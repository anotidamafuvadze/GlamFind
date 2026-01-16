import os
from typing import Any, Dict, Optional
import requests
from dotenv import load_dotenv

load_dotenv()

# TODO: Polish
# API Keys
SERPAPI_KEY = os.getenv("SERPAPI_KEY", "")

# Networking defaults
DEFAULT_TIMEOUT_S = 10

# More “browser-like” headers help Amazon/retailers return the real HTML + OG tags
UA_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;q=0.9,"
        "image/avif,image/webp,image/apng,*/*;q=0.8"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
}


# ----------------------------
# Image utilities
# ----------------------------
def _normalize_url(url: str) -> str:
    """
    Normalize common URL issues that can break RN or requests:
    - trim whitespace
    - ensure https
    - encode '+' as %2B (we've seen Amazon image paths with '+')
    """
    if not isinstance(url, str):
        return ""
    u = url.strip()
    if not u:
        return ""
    # Keep only https links
    if u.startswith("http://"):
        u = "https://" + u[len("http://") :]
    if not u.startswith("https://"):
        return ""
    # '+' in path/query can be interpreted inconsistently; encode it.
    # Safe for Amazon CDN image URLs.
    u = u.replace("+", "%2B")
    return u


def is_renderable_image_url(url: str, timeout: float = 6.0) -> bool:
    """
    Returns True only if the URL can be fetched and the response Content-Type is image/*.
    Uses a lightweight GET with stream=True (HEAD is often unsupported).
    """
    url = _normalize_url(url)
    if not url:
        return False

    try:
        r = requests.get(
            url,
            timeout=timeout,
            allow_redirects=True,
            stream=True,
            headers=UA_HEADERS,
        )
        if r.status_code != 200:
            return False
        content_type = (r.headers.get("Content-Type") or "").lower()
        return content_type.startswith("image/")
    except Exception:
        return False


def get_og_image(product_url: str, timeout: float = 8.0) -> str:
    """
    Fetch the product page HTML and extract <meta property="og:image" content="...">.
    Returns "" if unavailable.

    Fix 1: Prefer retailer product page og:image over CDN thumbnails.
    """
    product_url = _normalize_url(product_url)
    if not product_url:
        return ""

    try:
        resp = requests.get(
            product_url,
            timeout=timeout,
            allow_redirects=True,
            headers=UA_HEADERS,
        )
        if resp.status_code != 200:
            return ""

        html = resp.text or ""
        if not html:
            return ""

        # Minimal parsing without BeautifulSoup.
        import re

        # property="og:image"
        pattern = re.compile(
            r'<meta\s+[^>]*property=[\'"]og:image[\'"][^>]*content=[\'"]([^\'"]+)[\'"][^>]*>',
            re.IGNORECASE,
        )
        m = pattern.search(html)

        if not m:
            # sometimes sites use name="og:image"
            pattern2 = re.compile(
                r'<meta\s+[^>]*name=[\'"]og:image[\'"][^>]*content=[\'"]([^\'"]+)[\'"][^>]*>',
                re.IGNORECASE,
            )
            m = pattern2.search(html)

        og = (m.group(1).strip() if m else "")
        return _normalize_url(og)
    except Exception:
        return ""


def resolve_best_image(product_url: str, candidate_thumbnail: str) -> str:
    """
    Fix 1: Prefer retailer page og:image (validated) over thumbnails.
    Fallback to validated thumbnail.
    """
    product_url_n = _normalize_url(product_url)
    thumb_n = _normalize_url(candidate_thumbnail)

    og = get_og_image(product_url_n)
    if og and is_renderable_image_url(og):
        return og

    if thumb_n and is_renderable_image_url(thumb_n):
        return thumb_n

    return ""


# ----------------------------
# SerpAPI fetchers
# ----------------------------
def _fetch_serpapi_shopping(query: str, max_results: int) -> Optional[Dict[str, Any]]:
    """Fetch product data from SerpAPI's Google Shopping API."""
    if not SERPAPI_KEY:
        print("[PRODUCT_API] SerpAPI: Missing API key")
        return None

    url = "https://serpapi.com/search"
    params = {
        "api_key": SERPAPI_KEY,
        "engine": "google_shopping",
        "q": query,
        "num": max_results,
    }

    response = requests.get(url, params=params, timeout=DEFAULT_TIMEOUT_S, headers=UA_HEADERS)
    response.raise_for_status()
    data = response.json()

    shopping_results = data.get("shopping_results", []) or []
    if not shopping_results:
        return None

    product = shopping_results[0] or {}

    product_url = (product.get("link") or "").strip()
    thumb = (product.get("thumbnail") or "").strip()

    return {
        "product_url": product_url,
        "image_url": thumb,  # will be replaced by resolver later
        "price": product.get("price", "") or "",
        "rating": product.get("rating"),
        "rating_count": product.get("reviews"),
        "source_name": product.get("source", "") or "",
        "explanation": product.get("title", "") or "",
    }


def _fetch_serpapi_amazon(query: str, max_results: int) -> Optional[Dict[str, Any]]:
    """Fetch product data from SerpAPI's Amazon API."""
    if not SERPAPI_KEY:
        print("[PRODUCT_API] SerpAPI: Missing API key")
        return None

    url = "https://serpapi.com/search"
    params = {
        "api_key": SERPAPI_KEY,
        "engine": "amazon",
        "k": query,
        "amazon_domain": "amazon.com",
    }

    response = requests.get(url, params=params, timeout=DEFAULT_TIMEOUT_S, headers=UA_HEADERS)
    response.raise_for_status()
    data = response.json()

    organic_results = data.get("organic_results", []) or []
    if not organic_results:
        return None

    product = organic_results[0] or {}

    product_url = (product.get("link_clean") or product.get("link") or "").strip()
    thumb = (product.get("thumbnail") or "").strip()

    return {
        "product_url": product_url,
        "image_url": thumb,  # will be replaced by resolver later
        "price": product.get("price", "") or "",
        "rating": product.get("rating"),
        "rating_count": product.get("reviews"),
        "source_name": "Amazon",
        "explanation": product.get("title", "") or "",
    }


def _fetch_serpapi_ebay(query: str, max_results: int) -> Optional[Dict[str, Any]]:
    """Fetch product data from SerpAPI's eBay API."""
    if not SERPAPI_KEY:
        print("[PRODUCT_API] SerpAPI: Missing API key")
        return None

    url = "https://serpapi.com/search"
    params = {
        "api_key": SERPAPI_KEY,
        "engine": "ebay",
        "_nkw": query,
        "ebay_domain": "ebay.com",
    }

    response = requests.get(url, params=params, timeout=DEFAULT_TIMEOUT_S, headers=UA_HEADERS)
    response.raise_for_status()
    data = response.json()

    organic_results = data.get("organic_results", []) or []
    if not organic_results:
        return None

    product = organic_results[0] or {}

    product_url = (product.get("link") or "").strip()
    thumb = (product.get("thumbnail") or "").strip()

    return {
        "product_url": product_url,
        "image_url": thumb,  # will be replaced by resolver later
        "price": product.get("price", "") or "",
        "rating": product.get("rating"),
        "rating_count": product.get("reviews"),
        "source_name": "eBay",
        "explanation": product.get("title", "") or "",
    }


def _fetch_serpapi_walmart(query: str, max_results: int) -> Optional[Dict[str, Any]]:
    """Fetch product data from SerpAPI's Walmart API."""
    if not SERPAPI_KEY:
        print("[PRODUCT_API] SerpAPI: Missing API key")
        return None

    url = "https://serpapi.com/search"
    params = {
        "api_key": SERPAPI_KEY,
        "engine": "walmart",
        "query": query,
    }

    response = requests.get(url, params=params, timeout=DEFAULT_TIMEOUT_S, headers=UA_HEADERS)
    response.raise_for_status()
    data = response.json()

    organic_results = data.get("organic_results", []) or []
    if not organic_results:
        return None

    product = organic_results[0] or {}

    price = ""
    if isinstance(product.get("primary_offer"), dict):
        price = product["primary_offer"].get("offer_price") or ""

    product_url = (product.get("product_page_url") or "").strip()
    thumb = (product.get("thumbnail") or "").strip()

    return {
        "product_url": product_url,
        "image_url": thumb,  # will be replaced by resolver later
        "price": price,
        "rating": product.get("rating"),
        "rating_count": product.get("reviews"),
        "source_name": "Walmart",
        "explanation": product.get("title", "") or "",
    }


# Engine configuration
SEARCH_ENGINES = [
    {"name": "amazon", "fetch_func": _fetch_serpapi_amazon},
    {"name": "google_shopping", "fetch_func": _fetch_serpapi_shopping},
    {"name": "ebay", "fetch_func": _fetch_serpapi_ebay},
    {"name": "walmart", "fetch_func": _fetch_serpapi_walmart},
]


# ----------------------------
# Public API
# ----------------------------
def get_product_from_apis(
    brand: str,
    product_name: str,
    product_type: str,
    max_results: int = 3,
) -> Optional[Dict[str, Any]]:
    """
    Fetch product enrichment data from various product APIs.
    Tries multiple search engines in order until one returns a valid result
    with a renderable image (prefer og:image).
    """
    search_query = f"{brand} {product_name} {product_type}".strip()

    for engine_config in SEARCH_ENGINES:
        try:
            fetch_func = engine_config["fetch_func"]
            result = fetch_func(search_query, max_results)

            if not result:
                continue

            product_url = (result.get("product_url") or "").strip()
            thumb = (result.get("image_url") or "").strip()

            # Require a product_url (otherwise og:image is impossible and clicks break UX)
            if not product_url:
                continue

            # Fix 1: Prefer og:image from the product page; validate it; then fallback thumbnail.
            best_image = resolve_best_image(product_url, thumb)
            result["image_url"] = best_image

            # If you *require* images, keep this check.
            # If you want to allow image-less results (and show a placeholder), remove this.
            if _has_valid_thumbnail(result):
                return result

        except Exception as e:
            print(f"[PRODUCT_API] {engine_config['name']} search failed: {e}")
            continue

    return None


def _has_valid_thumbnail(enrichment: Dict[str, Any]) -> bool:
    """
    Check if enrichment data has a valid image_url string.
    (At this point we've already validated it's renderable, so this is a light check.)
    """
    image_url = enrichment.get("image_url")
    return isinstance(image_url, str) and len(image_url.strip()) > 0

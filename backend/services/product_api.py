import os
import re
from typing import Any, Callable, Dict, Optional, Tuple
from urllib.parse import quote, urlparse, urlunparse

import requests
from dotenv import load_dotenv

load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY", "")
DEFAULT_TIMEOUT_S = 10
OG_TIMEOUT_S = 8

# Browser-like headers for reliable HTML + OG tag responses.
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
}

# Optional strict image validation via HEAD requests (off by default).
ENABLE_IMAGE_HEAD_VALIDATION = False
IMAGE_HEAD_TIMEOUT_S = 4.0

# In-process cache: product_url -> (og_image_url, ok)
_OG_IMAGE_CACHE: Dict[str, Tuple[str, bool]] = {}

# Compiled once (avoid recompilation in hot paths)
IMAGE_EXT_RE = re.compile(r"\.(jpg|jpeg|png|webp)(\?|$)", re.IGNORECASE)
OG_IMAGE_META_RE = re.compile(
    r'<meta\s+[^>]*property=[\'"]og:image[\'"][^>]*content=[\'"]([^\'"]+)[\'"][^>]*>',
    re.IGNORECASE,
)
OG_IMAGE_META_FALLBACK_RE = re.compile(
    r'<meta\s+[^>]*name=[\'"]og:image[\'"][^>]*content=[\'"]([^\'"]+)[\'"][^>]*>',
    re.IGNORECASE,
)


def normalize_https_url(url: str) -> str:
    """Return a normalized HTTPS URL, or "" if invalid/untrusted."""
    if not isinstance(url, str):
        return ""

    u = url.strip()
    if not u:
        return ""

    # Force HTTPS for consistency + security.
    if u.startswith("http://"):
        u = "https://" + u[len("http://") :]

    if not u.startswith("https://"):
        return ""

    try:
        parsed = urlparse(u)
        if not parsed.netloc:
            return ""

        safe_path = quote(parsed.path, safe="/:@-._~!$&'()*+,;=")
        normalized = parsed._replace(path=safe_path)
        return urlunparse(normalized)
    except Exception:
        return ""


def is_public_https_url(url: str) -> bool:
    """Basic validation for public HTTPS URLs."""
    u = normalize_https_url(url)
    if not u:
        return False
    parsed = urlparse(u)
    return parsed.scheme == "https" and bool(parsed.netloc)


def looks_like_image_url(url: str) -> bool:
    """Cheap heuristic for image URLs (no network)."""
    u = normalize_https_url(url)
    if not u:
        return False

    # Fast-path: common Amazon CDN pattern.
    if "m.media-amazon.com/images/" in u:
        return True

    return bool(IMAGE_EXT_RE.search(u))


def head_says_image(url: str, timeout_s: float = IMAGE_HEAD_TIMEOUT_S) -> bool:
    """Optional strict check: confirm Content-Type starts with image/ via HEAD."""
    if not ENABLE_IMAGE_HEAD_VALIDATION:
        return True

    u = normalize_https_url(url)
    if not u:
        return False

    try:
        resp = requests.head(u, timeout=timeout_s, allow_redirects=True, headers=UA_HEADERS)
        try:
            if resp.status_code != 200:
                return False
            content_type = (resp.headers.get("Content-Type") or "").lower()
            return content_type.startswith("image/")
        finally:
            resp.close()
    except Exception:
        return False


def fetch_og_image(product_url: str, timeout_s: float = OG_TIMEOUT_S) -> str:
    """Fetch product page HTML and extract a normalized og:image URL (cached)."""
    page_url = normalize_https_url(product_url)
    if not page_url:
        return ""

    cached = _OG_IMAGE_CACHE.get(page_url)
    if cached is not None:
        cached_url, ok = cached
        return cached_url if ok else ""

    try:
        resp = requests.get(page_url, timeout=timeout_s, allow_redirects=True, headers=UA_HEADERS)
        try:
            if resp.status_code != 200:
                _OG_IMAGE_CACHE[page_url] = ("", False)
                return ""

            html = resp.text or ""
            if not html:
                _OG_IMAGE_CACHE[page_url] = ("", False)
                return ""

            m = OG_IMAGE_META_RE.search(html) or OG_IMAGE_META_FALLBACK_RE.search(html)
            og_raw = m.group(1).strip() if m else ""
            og_url = normalize_https_url(og_raw)

            if og_url and is_public_https_url(og_url):
                _OG_IMAGE_CACHE[page_url] = (og_url, True)
                return og_url

            _OG_IMAGE_CACHE[page_url] = ("", False)
            return ""
        finally:
            resp.close()
    except Exception:
        _OG_IMAGE_CACHE[page_url] = ("", False)
        return ""


def choose_best_image(product_url: str, api_thumbnail_url: str) -> str:
    """
    Pick the best image URL:
      1) og:image from product page (cached)
      2) API-provided thumbnail
    """
    page_url = normalize_https_url(product_url)
    thumb_url = normalize_https_url(api_thumbnail_url)

    og_url = fetch_og_image(page_url)
    if og_url and looks_like_image_url(og_url) and head_says_image(og_url):
        return og_url

    if thumb_url and looks_like_image_url(thumb_url) and head_says_image(thumb_url):
        return thumb_url

    return ""


def _serpapi_search(engine: str, params: Dict[str, Any]) -> Dict[str, Any]:
    """Low-level SerpAPI request helper."""
    resp = requests.get(
        "https://serpapi.com/search",
        params={"api_key": SERPAPI_KEY, "engine": engine, **params},
        timeout=DEFAULT_TIMEOUT_S,
        headers=UA_HEADERS,
    )
    resp.raise_for_status()
    return resp.json()


def fetch_google_shopping(query: str, max_results: int) -> Optional[Dict[str, Any]]:
    if not SERPAPI_KEY:
        return None

    data = _serpapi_search("google_shopping", {"q": query, "num": max_results})
    items = data.get("shopping_results", []) or []
    if not items:
        return None

    item = items[0] or {}
    return {
        "product_url": (item.get("link") or "").strip(),
        "image_url": (item.get("thumbnail") or "").strip(),
        "price": item.get("price", "") or "",
        "rating": item.get("rating"),
        "rating_count": item.get("reviews"),
        "source_name": item.get("source", "") or "",
        "explanation": item.get("title", "") or "",
    }


def fetch_amazon(query: str, max_results: int) -> Optional[Dict[str, Any]]:
    if not SERPAPI_KEY:
        return None

    data = _serpapi_search(
        "amazon",
        {"k": query, "amazon_domain": "amazon.com"},
    )
    items = data.get("organic_results", []) or []
    if not items:
        return None

    item = items[0] or {}
    product_url = (item.get("link_clean") or item.get("link") or "").strip()
    return {
        "product_url": product_url,
        "image_url": (item.get("thumbnail") or "").strip(),
        "price": item.get("price", "") or "",
        "rating": item.get("rating"),
        "rating_count": item.get("reviews"),
        "source_name": "Amazon",
        "explanation": item.get("title", "") or "",
    }


def fetch_ebay(query: str, max_results: int) -> Optional[Dict[str, Any]]:
    if not SERPAPI_KEY:
        return None

    data = _serpapi_search(
        "ebay",
        {"_nkw": query, "ebay_domain": "ebay.com"},
    )
    items = data.get("organic_results", []) or []
    if not items:
        return None

    item = items[0] or {}
    return {
        "product_url": (item.get("link") or "").strip(),
        "image_url": (item.get("thumbnail") or "").strip(),
        "price": item.get("price", "") or "",
        "rating": item.get("rating"),
        "rating_count": item.get("reviews"),
        "source_name": "eBay",
        "explanation": item.get("title", "") or "",
    }


def fetch_walmart(query: str, max_results: int) -> Optional[Dict[str, Any]]:
    if not SERPAPI_KEY:
        return None

    data = _serpapi_search("walmart", {"query": query})
    items = data.get("organic_results", []) or []
    if not items:
        return None

    item = items[0] or {}
    primary_offer = item.get("primary_offer")
    price = primary_offer.get("offer_price") if isinstance(primary_offer, dict) else ""

    return {
        "product_url": (item.get("product_page_url") or "").strip(),
        "image_url": (item.get("thumbnail") or "").strip(),
        "price": price or "",
        "rating": item.get("rating"),
        "rating_count": item.get("reviews"),
        "source_name": "Walmart",
        "explanation": item.get("title", "") or "",
    }


SearchFn = Callable[[str, int], Optional[Dict[str, Any]]]

SEARCH_ENGINES: Tuple[Tuple[str, SearchFn], ...] = (
    ("amazon", fetch_amazon),
    ("google_shopping", fetch_google_shopping),
    ("ebay", fetch_ebay),
    ("walmart", fetch_walmart),
)


def fetch_product_enrichment(
    brand: str,
    product_name: str,
    product_type: str,
    max_results: int = 3,
) -> Optional[Dict[str, Any]]:
    """Fetch enrichment from multiple sources; return the first usable result."""
    query = f"{brand} {product_name} {product_type}".strip()

    for _engine_name, fetch_fn in SEARCH_ENGINES:
        try:
            result = fetch_fn(query, max_results)
            if not result:
                continue

            product_url = (result.get("product_url") or "").strip()
            if not product_url:
                continue  # require click-through URL

            thumb_url = (result.get("image_url") or "").strip()
            result["image_url"] = choose_best_image(product_url, thumb_url)
            return result
        except Exception:
            continue

    return None

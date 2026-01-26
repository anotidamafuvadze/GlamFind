"""
Product enrichment via SerpAPI + image URL resolution.

Key fixes (prevents FastImage timeouts / CDN throttling):
- DO NOT download image URLs just to “validate” them (removes double-fetching + rate-limit issues).
- If you must validate, do it with a HEAD (optional) and always close responses.
- Remove forced "Connection: keep-alive" header (requests already manages pooling).
- Normalize URLs safely (don’t mutate image paths by replacing '+' globally).
- Add a small in-process cache to avoid re-fetching og:image for the same product_url.
"""

import os
import re
from typing import Any, Dict, Optional, Tuple
from urllib.parse import urlparse, urlunparse, quote

import requests
from dotenv import load_dotenv

load_dotenv()

# ----------------------------
# Config
# ----------------------------
SERPAPI_KEY = os.getenv("SERPAPI_KEY", "")

DEFAULT_TIMEOUT_S = 10
OG_TIMEOUT_S = 8

# “Browser-like” headers help some retailers return proper HTML + OG tags.
# IMPORTANT: Do not force Connection: keep-alive — requests manages this.
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

# If you want strict image validation, flip this on.
# It uses HEAD where possible and always closes responses, but it still hits CDNs.
ENABLE_IMAGE_HEAD_VALIDATION = False
IMAGE_HEAD_TIMEOUT_S = 4.0

# Small in-process cache for OG image lookups:
# key=(product_url_normalized) -> value=(og_image_url_normalized, ok_bool)
_OG_CACHE: Dict[str, Tuple[str, bool]] = {}


# ----------------------------
# URL utilities
# ----------------------------
IMAGE_EXT_PATTERN = re.compile(r"\.(jpg|jpeg|png|webp)(\?|$)", re.IGNORECASE)


def _normalize_url(url: str) -> str:
    """
    Normalize URL:
    - trim whitespace
    - enforce https
    - ensure it parses
    - percent-encode spaces and other unsafe chars (but do NOT rewrite '+' arbitrarily)
    """
    if not isinstance(url, str):
        return ""

    u = url.strip()
    if not u:
        return ""

    # Force https if http
    if u.startswith("http://"):
        u = "https://" + u[len("http://") :]

    if not u.startswith("https://"):
        return ""

    try:
        parsed = urlparse(u)
        if not parsed.netloc:
            return ""

        # Encode path safely (preserve / and common safe chars)
        safe_path = quote(parsed.path, safe="/:@-._~!$&'()*+,;=")
        safe_query = parsed.query  # leave query as-is; usually already encoded by APIs

        normalized = parsed._replace(path=safe_path, query=safe_query)
        return urlunparse(normalized)
    except Exception:
        return ""


def looks_like_image_url(url: str) -> bool:
    """
    Lightweight check only (no network).
    This avoids backend fetching images that the client will fetch anyway.
    """
    u = _normalize_url(url)
    if not u:
        return False

    # Most CDNs don't include extensions in a predictable way, but Amazon m.media does.
    if "m.media-amazon.com/images/" in u:
        return True

    return bool(IMAGE_EXT_PATTERN.search(u))


def is_probably_public_http_url(url: str) -> bool:
    u = _normalize_url(url)
    if not u:
        return False
    parsed = urlparse(u)
    return parsed.scheme == "https" and bool(parsed.netloc)


# ----------------------------
# Optional HEAD validation (off by default)
# ----------------------------
def _head_is_image(url: str, timeout: float = IMAGE_HEAD_TIMEOUT_S) -> bool:
    """
    Optional strict validation with HEAD.
    Still hits CDNs; keep off unless necessary.
    """
    if not ENABLE_IMAGE_HEAD_VALIDATION:
        return True

    u = _normalize_url(url)
    if not u:
        return False

    try:
        r = requests.head(u, timeout=timeout, allow_redirects=True, headers=UA_HEADERS)
        try:
            if r.status_code != 200:
                return False
            ct = (r.headers.get("Content-Type") or "").lower()
            return ct.startswith("image/")
        finally:
            r.close()
    except Exception:
        return False


# ----------------------------
# OG image extraction
# ----------------------------
def get_og_image(product_url: str, timeout: float = OG_TIMEOUT_S) -> str:
    """
    Fetch product page HTML and extract <meta property="og:image" content="...">.
    Returns "" if unavailable.

    Uses an in-process cache to avoid repeated page fetches.
    """
    product_url_n = _normalize_url(product_url)
    if not product_url_n:
        return ""

    if product_url_n in _OG_CACHE:
        cached_url, ok = _OG_CACHE[product_url_n]
        return cached_url if ok else ""

    try:
        resp = requests.get(
            product_url_n,
            timeout=timeout,
            allow_redirects=True,
            headers=UA_HEADERS,
        )
        try:
            if resp.status_code != 200:
                _OG_CACHE[product_url_n] = ("", False)
                return ""

            html = resp.text or ""
            if not html:
                _OG_CACHE[product_url_n] = ("", False)
                return ""

            # Minimal regex parsing (no BeautifulSoup dependency)
            pattern = re.compile(
                r'<meta\s+[^>]*property=[\'"]og:image[\'"][^>]*content=[\'"]([^\'"]+)[\'"][^>]*>',
                re.IGNORECASE,
            )
            m = pattern.search(html)

            if not m:
                pattern2 = re.compile(
                    r'<meta\s+[^>]*name=[\'"]og:image[\'"][^>]*content=[\'"]([^\'"]+)[\'"][^>]*>',
                    re.IGNORECASE,
                )
                m = pattern2.search(html)

            og_raw = (m.group(1).strip() if m else "")
            og_n = _normalize_url(og_raw)

            if og_n and is_probably_public_http_url(og_n):
                _OG_CACHE[product_url_n] = (og_n, True)
                return og_n

            _OG_CACHE[product_url_n] = ("", False)
            return ""
        finally:
            resp.close()
    except Exception:
        _OG_CACHE[product_url_n] = ("", False)
        return ""


def resolve_best_image(product_url: str, candidate_thumbnail: str) -> str:
    """
    Prefer product page og:image (no network validation by default),
    fallback to thumbnail.
    """
    product_url_n = _normalize_url(product_url)
    thumb_n = _normalize_url(candidate_thumbnail)

    # 1) og:image
    og = get_og_image(product_url_n)
    if og and looks_like_image_url(og) and _head_is_image(og):
        return og

    # 2) candidate thumbnail
    if thumb_n and looks_like_image_url(thumb_n) and _head_is_image(thumb_n):
        return thumb_n

    return ""


# ----------------------------
# SerpAPI fetchers
# ----------------------------
def _fetch_serpapi_shopping(query: str, max_results: int) -> Optional[Dict[str, Any]]:
    """Fetch product data from SerpAPI's Google Shopping API."""
    if not SERPAPI_KEY:
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
    Tries multiple search engines until one returns a result.

    Image strategy:
    - Prefer og:image from product_url (cached)
    - Fallback to thumbnail
    - DO NOT “download to validate” images (prevents throttling/timeouts)
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

            # Require a product_url (click-through UX + og:image extraction)
            if not product_url:
                continue

            best_image = resolve_best_image(product_url, thumb)
            result["image_url"] = best_image
            return result

        except Exception as e:
            continue

    return None


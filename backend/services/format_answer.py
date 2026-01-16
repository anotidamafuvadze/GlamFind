from typing import Any, Dict, List
from urllib.parse import urlparse


def _is_valid_http_url(url: str) -> bool:
    """Valid, absolute http(s) URL."""
    if not url or not isinstance(url, str):
        return False
    url = url.strip()
    if not url:
        return False
    try:
        parsed = urlparse(url)
        return parsed.scheme in ("http", "https") and bool(parsed.netloc)
    except Exception:
        return False


def _is_rn_renderable_image_url(url: str) -> bool:
    """
    Heuristic for React Native <Image source={{ uri }} /> compatibility
    for *remote* images coming from APIs.
    """
    # if not url or not isinstance(url, str):
    #     return False

    # u = url.strip()
    # if not u:
    #     return False

    # lowered = u.lower()
    # if lowered in ("null", "none", "undefined"):
    #     return False

    # # No whitespace/newlines
    # if any(c.isspace() for c in u):
    #     return False

    # # Prefer https for mobile reliability
    # if not _is_valid_http_url(u):
    #     return False
    # if urlparse(u).scheme != "https":
    #     return False

    return True


def _has_meaningful_enrichment(p: Dict[str, Any]) -> bool:
    """True if *any* useful enrichment exists (not just empty strings/zeros)."""
    if _is_valid_http_url(p.get("product_url", "")):
        return True
    if _is_rn_renderable_image_url(p.get("image_url", "")):
        return True

    if (p.get("price") or "").strip():
        return True

    rating = float(p.get("rating") or 0.0)
    rating_count = int(p.get("rating_count") or 0)
    if rating > 0.0 or rating_count > 0:
        return True

    if (p.get("source_name") or "").strip():
        return True

    if (p.get("explanation") or "").strip():
        return True

    return False


def _sort_key(p: Dict[str, Any]) -> tuple:
    """
    Sort priority (best first):

    A) image renderable + product_url valid
    B) image renderable (even if no product_url)
    C) no image, but meaningful enrichment
    D) no meaningful enrichment
    """
    has_img = _is_rn_renderable_image_url(p.get("image_url", ""))
    has_url = _is_valid_http_url(p.get("product_url", ""))
    meaningful = _has_meaningful_enrichment(p)

    if has_img and has_url:
        group = 0
    elif has_img:
        group = 1
    elif meaningful:
        group = 2
    else:
        group = 3

    rating_count = int(p.get("rating_count") or 0)
    rating = float(p.get("rating") or 0.0)
    has_price = bool((p.get("price") or "").strip())

    return (group, -rating_count, -rating, -int(has_price))


def _pick_str(top_level_val: Any, nested_val: Any) -> str:
    """
    Prefer a non-empty top-level string; otherwise use nested string.
    Returns a stripped string (or "").
    """
    if isinstance(top_level_val, str) and top_level_val.strip():
        return top_level_val.strip()
    if isinstance(nested_val, str) and nested_val.strip():
        return nested_val.strip()
    return ""


def _pick_num(top_level_val: Any, nested_val: Any, cast_fn, default):
    """
    Prefer a non-null-ish top-level numeric; otherwise nested.
    Safely casts using cast_fn; returns default on failure.
    """
    candidate = top_level_val
    if candidate is None or candidate == "" or candidate is False:
        candidate = nested_val
    try:
        if candidate is None or candidate == "":
            return default
        return cast_fn(candidate)
    except Exception:
        return default


def format_recommendation_response(query: str, enriched_products: List[Dict[str, Any]]) -> Dict[str, Any]:
    formatted_products: List[Dict[str, Any]] = []

    for product in enriched_products:
        enrichment = product.get("enrichment") or {}

        # --- Flatten: prefer top-level fields if present, else enrichment fields ---
        product_url = _pick_str(product.get("product_url"), enrichment.get("product_url"))
        image_url = _pick_str(product.get("image_url"), enrichment.get("image_url"))
        price = _pick_str(product.get("price"), enrichment.get("price"))
        source_name = _pick_str(product.get("source_name"), enrichment.get("source_name"))
        explanation = _pick_str(product.get("explanation"), enrichment.get("explanation"))

        rating = _pick_num(product.get("rating"), enrichment.get("rating"), float, 0.0)
        rating_count = _pick_num(product.get("rating_count"), enrichment.get("rating_count"), int, 0)

        # --- Enforce URL sanity (optional but strongly recommended) ---
        if product_url and not _is_valid_http_url(product_url):
            print(f"[FORMAT] Product {product.get('id')} has invalid product_url; blanking: {product_url[:120]}")
            product_url = ""

        if image_url and not _is_rn_renderable_image_url(image_url):
            print(
                f"[FORMAT] Product {product.get('id')} ({product.get('brand')} {product.get('name')}): "
                f"image_url not RN-renderable; blanking: {image_url[:120]}"
            )
            image_url = ""

        formatted = {
            "id": str(product.get("id", "") or ""),
            "name": _pick_str(product.get("name"), enrichment.get("name")),
            "brand": _pick_str(product.get("brand"), enrichment.get("brand")),

            # flattened fields (what your RN app should read)
            "product_url": product_url,
            "image_url": image_url,
            "price": price,
            "rating": rating,
            "rating_count": rating_count,
            "source_name": source_name,
            "explanation": explanation,
        }

        print(f"[DEBUG] Product {product.get('id')} image_url: '{image_url}'")
        formatted_products.append(formatted)

    formatted_products.sort(key=_sort_key)
    return {"query": query, "products": formatted_products}

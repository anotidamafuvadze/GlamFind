from typing import Dict, Any, List, Optional, TypedDict
from langchain_core.documents import Document

from services.web_search import web_search
from services.extraction import extract_enrichments
from data.cache.sqlite_enrichment_cache import SQLiteEnrichmentCache


def _validate_enrichment(enrichment: Any) -> Optional[Dict[str, Any]]:
    """
    Ensures enrichment is either None or a dict with sane fields.
    Keeps this lightweight (no Pydantic).
    """

    if enrichment is None:
        return None
    if not isinstance(enrichment, dict):
        return None

    # Copy only known keys
    allowed_keys = {
        "product_url",
        "image_url",
        "price",
        "rating",
        "rating_count",
        "source_name",
        "explanation",
    }

    clean: Dict[str, Any] = {k: enrichment.get(k) for k in allowed_keys if k in enrichment}

    # Validate rating (0..5)
    rating = clean.get("rating")
    if rating is not None:
        try:
            rating_float = float(rating)
        except (TypeError, ValueError):
            clean.pop("rating", None)
        else:
            if 0.0 <= rating_float <= 5.0:
                clean["rating"] = rating_float
            else:
                clean.pop("rating", None)

    # Validate rating_count (>=0)
    rating_count = clean.get("rating_count")
    if rating_count is not None:
        try:
            rc_int = int(rating_count)
        except (TypeError, ValueError):
            clean.pop("rating_count", None)
        else:
            if rc_int >= 0:
                clean["rating_count"] = rc_int
            else:
                clean.pop("rating_count", None)

    return clean


def get_enriched_products(products: List[Document]) -> List[Dict[str, Any]]:
    enriched_results: List[Dict[str, Any]] = []
    cache = SQLiteEnrichmentCache()

    for product in products:
        metadata = product.metadata or {}
        pid = metadata.get("id") or cache.generate_key(metadata)

        cached = cache.get(pid)

        # Check cache hit
        if isinstance(cached, dict) and cached.get("id"):
            enriched_results.append(cached)
            continue

        brand = metadata.get("brand", "") or ""
        name = metadata.get("name", "") or ""
        product_type = metadata.get("product_type", "") or ""
        product_description = metadata.get("description", "") or ""

        base_obj: Dict[str, Any] = {
            "id": pid,
            "brand": brand,
            "name": name,
            "product_type": product_type,
            "product_description": product_description,
            "enrichment": None,
        }

        # If missing required fields, return minimal object
        if not all([brand, name, product_type, product_description]):
            enriched_results.append(base_obj)
            cache.set(pid, base_obj)
            continue

        try:
            candidates = web_search(brand, name, product_type, k=6)
            extracted = extract_enrichments(brand, name, product_type, candidates)

            base_obj["enrichment"] = _validate_enrichment(extracted)

            cache.set(pid, base_obj)
            enriched_results.append(base_obj)

        except Exception as e:
            print(f"Error enriching product {pid}: {e}")
            cache.set(pid, base_obj)
            enriched_results.append(base_obj)

    return enriched_results

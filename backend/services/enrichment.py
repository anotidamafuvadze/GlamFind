from typing import Any, Dict, List, Optional
from langchain_core.documents import Document
from services.product_api import get_product_from_apis
from services.supabase_enrichment_cache import SupabaseEnrichmentCache

# TODO: Reset cache
def get_enriched_products(products: List[Document], user_query: str = "") -> List[Dict[str, Any]]:
    """Enrich product documents with external data and caching using Supabase products table."""
    print(f"[DEBUG] get_enriched_products: Received {len(products)} products for query '{user_query}'")
    enriched_products: List[Dict[str, Any]] = []
    cache = SupabaseEnrichmentCache()

    for idx, product in enumerate(products):
        metadata = product.metadata or {}
        print(f"[DEBUG] Product {idx} metadata: {metadata}")
        product_external_id = metadata.get("id") or cache.generate_key(metadata)

        # Check Supabase cache first
        cached_product = cache.get(product_external_id)
        if isinstance(cached_product, dict) and cached_product.get("id"):
            print(f"[DEBUG] Product {product_external_id} found in cache: {cached_product}")
            enriched_products.append(cached_product)
            continue

        brand = metadata.get("brand", "") or ""
        name = metadata.get("name", "") or ""
        product_type = metadata.get("product_type", "") or ""
        description = metadata.get("description", "") or ""

        product_data: Dict[str, Any] = {
            "id": None,  # Will be set by DB
            "external_id": product_external_id,
            "brand": brand,
            "name": name,
            "product_type": product_type,
            "product_description": description,
            "enrichment": None,
        }

        has_required_fields = all([brand, name, product_type, description])
        if not has_required_fields:
            print(f"[DEBUG] Skipping enrichment for product {product_external_id}: missing required fields (brand={brand}, name={name}, type={product_type}, desc={description})")
            cache.set(product_external_id, product_data)
            enriched_products.append(product_data)
            continue

        try:
            print(f"[DEBUG] Enriching product {product_external_id} with brand={brand}, name={name}, type={product_type}")
            raw_enrichment = get_product_from_apis(brand, name, product_type, max_results=3)
            print(f"[DEBUG] Raw enrichment for {product_external_id}: {raw_enrichment}")
            validated = _validate_enrichment_data(raw_enrichment)
            print(f"[DEBUG] Validated enrichment for product {product_external_id}: {validated}")
            product_data["enrichment"] = validated
            cache.set(product_external_id, product_data)
            enriched_products.append(product_data)
        except Exception as error:
            print(f"[DEBUG] Enrichment error for product {product_external_id}: {error}")
            import traceback
            traceback.print_exc()
            cache.set(product_external_id, product_data)
            enriched_products.append(product_data)

    print(f"[DEBUG] Returning {len(enriched_products)} enriched products")
    return enriched_products

def _validate_enrichment_data(enrichment_data: Any) -> Optional[Dict[str, Any]]:
    """Clean and validate enrichment data.
    
    Args:
        enrichment_data: Raw enrichment data from extraction
        
    Returns:
        Cleaned dict with validated fields, or None if invalid
    """
    if enrichment_data is None:
        return None
    if not isinstance(enrichment_data, dict):
        return None
    
    # If completely empty, return None
    if not enrichment_data:
        return None

    # Define allowed enrichment fields
    ALLOWED_FIELDS = {
        "product_url",
        "image_url", 
        "price",
        "rating",
        "rating_count",
        "source_name",
        "explanation",
    }
    
    # Filter to allowed fields only
    cleaned_data: Dict[str, Any] = {
        field: enrichment_data.get(field)
        for field in ALLOWED_FIELDS
        if field in enrichment_data
    }
    
    # If no enrichment fields were found, return None
    if not cleaned_data:
        return None

    # Validate rating range (0.0 to 5.0)
    rating = cleaned_data.get("rating")
    if rating is not None:
        try:
            rating_value = float(rating)
            if 0.0 <= rating_value <= 5.0:
                cleaned_data["rating"] = rating_value
            else:
                cleaned_data.pop("rating", None)
        except (ValueError, TypeError):
            cleaned_data.pop("rating", None)

    # Validate rating count (non-negative integer)
    rating_count = cleaned_data.get("rating_count")
    if rating_count is not None:
        try:
            count_value = int(rating_count)
            if count_value >= 0:
                cleaned_data["rating_count"] = count_value
            else:
                cleaned_data.pop("rating_count", None)
        except (ValueError, TypeError):
            cleaned_data.pop("rating_count", None)
    
    # Clean up empty string values (convert to None for consistency)
    for key in list(cleaned_data.keys()):
        value = cleaned_data[key]
        if isinstance(value, str) and not value.strip():
            cleaned_data[key] = None

    # Only return if we have at least one valid field with actual content
    has_valid_data = any(
        v is not None and v != "" 
        for v in cleaned_data.values()
    )
    
    return cleaned_data if has_valid_data else None
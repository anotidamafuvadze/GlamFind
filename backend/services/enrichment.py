from typing import Any, Dict, List, Optional
from langchain_core.documents import Document
from services.product_api import get_product_from_apis
from data.cache.sqlite_enrichment_cache import SQLiteEnrichmentCache

# TODO: Reset cache
def get_enriched_products(products: List[Document], user_query: str = "") -> List[Dict[str, Any]]:
    """Enrich product documents with external data and caching.
    
    Args:
        products: List of Document objects with product metadata
        
    Returns:
        List of enriched product dictionaries with optional enrichment data
    """
    enriched_products: List[Dict[str, Any]] = []
    cache = SQLiteEnrichmentCache()

    for product in products:
        metadata = product.metadata or {}
        
        # Generate or retrieve product identifier
        product_id = metadata.get("id") or cache.generate_key(metadata)
        
        # Check cache first
        cached_product = cache.get(product_id)
        if isinstance(cached_product, dict) and cached_product.get("id"):
            enriched_products.append(cached_product)
            continue

        # Extract base product information
        brand = metadata.get("brand", "") or ""
        name = metadata.get("name", "") or ""
        product_type = metadata.get("product_type", "") or ""
        description = metadata.get("description", "") or ""

        # Create base product object
        product_data: Dict[str, Any] = {
            "id": product_id,
            "brand": brand,
            "name": name,
            "product_type": product_type,
            "product_description": description,
            "enrichment": None,
        }

        # Skip enrichment if required fields are missing
        has_required_fields = all([brand, name, product_type, description])
        if not has_required_fields:
            print(f"Skipping enrichment for product {product_id}: missing required fields")
            cache.set(product_id, product_data)
            enriched_products.append(product_data)
            continue

        try:
            # Fetch enrichment data from product APIs
            raw_enrichment = get_product_from_apis(brand, name, product_type, max_results=3)
            
            # Clean and validate enrichment data
            validated = _validate_enrichment_data(raw_enrichment)
            print(f"Validated enrichment for product {product_id}: {validated}")
            product_data["enrichment"] = validated
            
            cache.set(product_id, product_data)
            enriched_products.append(product_data)

        except Exception as error:
            # Handle enrichment failures
            print(f"Enrichment error for product {product_id}: {error}")
            import traceback
            traceback.print_exc()
            cache.set(product_id, product_data)
            enriched_products.append(product_data)

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
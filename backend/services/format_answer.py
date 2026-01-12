from typing import Any, Dict, List


def format_recommendation_response(query: str, enriched_products: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Format enriched product data into the final API response payload
    expected by the frontend.

    Args:
        query (str): Original user search query.
        enriched_products (List[Dict[str, Any]]): Products with optional enrichment data.

    Returns:
        Dict[str, Any]: Response object containing the query and formatted products.
    """
    formatted_products: List[Dict[str, Any]] = []

    for product in enriched_products:
        # Enrichment may be missing or None; always treat it as a dict
        enrichment = product.get("enrichment") or {}
        
        # Debug logging
        product_id = product.get("id", "")
        image_url = enrichment.get("image_url", "")
        if not image_url:
            print(f"[FORMAT] Product {product_id} ({product.get('brand')} {product.get('name')}): No image_url - enrichment={bool(enrichment)}")

        formatted_products.append(
            {
                # Core product identity
                "id": product.get("id", ""),
                "name": product.get("name", ""),
                "brand": product.get("brand", ""),

                # Enriched fields (safe defaults)
                "product_url": enrichment.get("product_url") or "",
                "image_url": enrichment.get("image_url") or "",
                "price": enrichment.get("price") or "",

                # Ratings (normalized defaults)
                "rating": float(enrichment.get("rating") or 0.0),
                "rating_count": int(enrichment.get("rating_count") or 0),

                # Source & explanation
                "source_name": enrichment.get("source_name") or "",
                "explanation": enrichment.get("explanation") or "",
            }
        )

    return {
        "query": query,
        "products": formatted_products,
    }

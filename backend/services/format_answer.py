import json
from typing import Any, Dict, List


def get_final_answer(user_query: str, enriched_products: List[Dict[str, Any]]) -> Dict[str, Any]:
    formatted_products = []
    
    for product in enriched_products:
        enrichment = product.get("enrichment") or {}
        
        formatted_product = {
            "id": product.get("id", ""),
            "name": product.get("name", ""),
            "brand": product.get("brand", ""),
            "product_url": enrichment.get("product_url", ""),
            "image_url": enrichment.get("image_url", ""),
            "price": enrichment.get("price", ""),
            "rating": enrichment.get("rating") or 0.0,
            "rating_count": enrichment.get("rating_count") or 0,
            "source_name": enrichment.get("source_name", ""),
            "explanation": enrichment.get("explanation", ""),
        }
        
        formatted_products.append(formatted_product)
    
    return {
        "query": user_query,
        "products": formatted_products,
    }

from typing import Dict, Any, List, Optional
from langchain_core.documents import Document
from pydantic import BaseModel, Field, validator

from services.web_search import web_search
from services.extraction import extract_enrichments
from data.cache.sqlite_enrichment_cache import SQLiteEnrichmentCache


class ProductEnrichment(BaseModel):
    product_url: Optional[str] = None
    image_url: Optional[str] = None
    price: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    rating_count: Optional[int] = Field(None, ge=0)
    source_name: Optional[str] = None

    @validator("rating")
    def validate_rating(cls, v):
        if v is not None and (v < 0 or v > 5):
            raise ValueError("Rating must be between 0 and 5")
        return v


class EnrichedProduct(BaseModel):
    id: str
    brand: str
    name: str
    product_type: str
    product_description: Optional[str] = None
    metadata: Dict[str, Any]
    enrichment: Optional[ProductEnrichment]


def _to_dict(model: BaseModel) -> Dict[str, Any]:
    """Supports both Pydantic v1 (.dict) and v2 (.model_dump)."""
    if hasattr(model, "model_dump"):
        return model.model_dump()
    return model.dict()


def get_enriched_products(products: List[Document]) -> List[EnrichedProduct]:
    enriched_results: List[EnrichedProduct] = []
    cache = SQLiteEnrichmentCache()

    for product in products:
        metadata = product.metadata or {}
        pid = metadata.get("id") or cache.generate_key(metadata)
        
        cached = cache.get(pid)

        # Check cache first
        if cached:
            try:
                enriched_results.append(EnrichedProduct(**cached))
                continue
            except Exception:
                pass

        # Required fields for enrichment
        brand = metadata.get("brand", "")
        name = metadata.get("name", "")
        product_type = metadata.get("product_type", "")
        product_description = metadata.get("description", "")

        # If missing required fields, return minimal object
        if not all([brand, name, product_type, product_description]):
            enriched_results.append(
                EnrichedProduct(
                    id=pid,
                    brand=brand,
                    name=name,
                    product_type=product_type,
                    product_description=product_description,
                    metadata=metadata,
                    enrichment=None,
                )
            )
            continue

        try:
            candidates = web_search(brand, name, product_type, k=6)
            extracted = extract_enrichments(brand, name, product_type, candidates)

            enriched_product = EnrichedProduct(
                id=pid,
                brand=brand,
                name=name,
                product_type=product_type,
                product_description=product_description,
                metadata=metadata,
                enrichment=extracted,
            )

            # Save to cache as plain dict
            cache.set(pid, _to_dict(enriched_product))
            enriched_results.append(enriched_product)

        except Exception as e:
            print(f"Error enriching product {pid}: {e}")
            enriched_results.append(
                EnrichedProduct(
                    id=pid,
                    brand=brand,
                    name=name,
                    product_type=product_type,
                    product_description=product_description,
                    metadata=metadata,
                    enrichment=None,
                )
            )

    return enriched_results

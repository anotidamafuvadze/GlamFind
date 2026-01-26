from typing import Any, Dict, Optional
from supabase import create_client, Client
import os
import hashlib
import json

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

class SupabaseEnrichmentCache:
    def __init__(self):
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise ValueError("Supabase credentials are not set in environment variables.")
        self.client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.table = "products"

    def generate_key(self, metadata: Dict[str, Any]) -> str:
        # Use a hash of brand+name+product_type for uniqueness if no id
        key_str = f"{metadata.get('brand','')}|{metadata.get('name','')}|{metadata.get('product_type','')}"
        return hashlib.sha256(key_str.encode()).hexdigest()

    def get(self, external_id: str) -> Optional[Dict[str, Any]]:
        try:
            response = self.client.table(self.table).select("*").eq("external_id", external_id).single().execute()
            data = response.data
            if not data:
                return None
            product = {
                "id": data.get("id"),  # Use the UUID PK for unique id
                "external_id": data.get("external_id"),
                "brand": data.get("brand"),
                "name": data.get("name"),
                "product_type": None,  # Not in schema, can be set to None
                "product_description": None,  # Not in schema, can be set to None
                "enrichment": {
                    "product_url": data.get("product_url"),
                    "image_url": data.get("image_url"),
                    "price": data.get("price"),
                    "rating": data.get("rating"),
                    "rating_count": data.get("rating_count"),
                    "source_name": data.get("source_name"),
                    "explanation": data.get("explanation"),
                },
            }
            return product
        except Exception:
            return None

    def set(self, external_id: str, product_data: Dict[str, Any]) -> None:
        # Upsert product data into Supabase products table using external_id as unique key
        try:
            enrichment = product_data.get("enrichment") or {}
            db_row = {
                "external_id": external_id,
                "name": product_data.get("name"),
                "brand": product_data.get("brand"),
                "product_url": enrichment.get("product_url"),
                "image_url": enrichment.get("image_url"),
                "price": enrichment.get("price"),
                "rating": enrichment.get("rating"),
                "rating_count": enrichment.get("rating_count"),
                "source_name": enrichment.get("source_name"),
                "explanation": enrichment.get("explanation"),
            }
            self.client.table(self.table).upsert(db_row, on_conflict="external_id").execute()
        except Exception:
            pass

# main.py

import os
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, Body, HTTPException

from services.vector_store import get_vector_store
from services.retrieval import retrieve_top_products
from services.enrichment import get_enriched_products
from services.format_answer import format_recommendation_response
from services.refine_query import refine_query

# ✅ image proxy router
from services.image_proxy import router as image_proxy_router

load_dotenv()

# Base paths
BASE_DIR = Path(__file__).resolve().parents[1]
CSV_DATA_PATH = BASE_DIR / "data" / "beautyProducts.csv"
FAISS_INDEX_DIR = BASE_DIR / "vectorstores" / "faiss_beauty"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize and manage the vector store lifecycle."""
    app.state.vector_store = get_vector_store(
        csv_path=str(CSV_DATA_PATH),
        faiss_dir=str(FAISS_INDEX_DIR),
    )
    yield


app = FastAPI(title="Product RAG API", lifespan=lifespan)

# ✅ Mount image proxy route(s) under /api to match your existing API convention
# This adds: GET/HEAD /api/image-proxy?url=...
app.include_router(image_proxy_router, prefix="/api")
@app.post("/api/refinedrecommendations")

def refined_recommend_products(new_query: str = Body(..., embed=False), original_query: str = Body(..., embed=False)):
    """Endpoint for refined product recommendations based on previous query."""
    try:
        user_query = refine_query(original_query, new_query)
        vector_store = app.state.vector_store

        retrieved_products = retrieve_top_products(vector_store, user_query, 5)

        if retrieved_products:
            pass

        enriched_products = get_enriched_products(retrieved_products, user_query)

        if enriched_products:
            pass


        recommendations = format_recommendation_response(user_query, enriched_products)
        recommended_count = len(recommendations.get("products", []))

        return recommendations

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
    
@app.post("/api/recommendations")
def recommend_products(user_query: str = Body(..., embed=False)):
    """Main endpoint for product recommendations using RAG pipeline."""
    try:
        vector_store = app.state.vector_store

        retrieved_products = retrieve_top_products(vector_store, user_query, 5)

        if retrieved_products:
            pass

        enriched_products = get_enriched_products(retrieved_products, user_query)

        if enriched_products:
            pass


        recommendations = format_recommendation_response(user_query, enriched_products)
        recommended_count = len(recommendations.get("products", []))

        return recommendations

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

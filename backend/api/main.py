import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.vector_store import get_vector_store
from services.retrieval import retrieve_top_products
from services.enrichment import get_enriched_products
from services.format_answer import format_recommendation_response
from services.refine_query import refine_query
from services.image_proxy import router as image_proxy_router

# TODO: polish
# Load environment variables
load_dotenv()

# -----------------------------
# Paths / Data
# -----------------------------
BASE_DIR = Path(__file__).resolve().parents[1]
CSV_DATA_PATH = BASE_DIR / "data" / "beautyProducts.csv"
FAISS_INDEX_DIR = BASE_DIR / "vectorstores" / "faiss_beauty"

# -----------------------------
# App lifecycle
# -----------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize and manage the vector store lifecycle."""
    app.state.vector_store = get_vector_store(
        csv_path=str(CSV_DATA_PATH),
        faiss_dir=str(FAISS_INDEX_DIR),
    )
    yield


app = FastAPI(title="Product RAG API", lifespan=lifespan)

# -----------------------------
# CORS (Render-friendly)
# -----------------------------
# Set CORS_ORIGINS to a comma-separated list, e.g.
# CORS_ORIGINS=http://localhost:19006,http://localhost:8081,https://your-frontend-domain.com
cors_origins_raw = os.getenv("CORS_ORIGINS", "").strip()
cors_allow_all = os.getenv("CORS_ALLOW_ALL", "false").lower() == "true"

origins: List[str] = [o.strip() for o in cors_origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if cors_allow_all else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Routes
# -----------------------------
# Mount image proxy route under /api
app.include_router(image_proxy_router, prefix="/api")


@app.get("/health")
def health():
    return {"ok": True}


# -----------------------------
# Request Models
# -----------------------------
class RecommendationsRequest(BaseModel):
    query: str


class RefinedRecommendationsRequest(BaseModel):
    new_query: str
    original_query: str


@app.post("/api/recommendations")
def recommend_products(payload: RecommendationsRequest):
    """
    Main endpoint for product recommendations using RAG pipeline.

    Expected JSON body:
      { "query": "..." }
    """
    try:
        user_query = payload.query.strip()
        if not user_query:
            raise HTTPException(status_code=400, detail="Query cannot be empty")

        vector_store = app.state.vector_store
        retrieved_products = retrieve_top_products(vector_store, user_query, 5)
        enriched_products = get_enriched_products(retrieved_products)
        return format_recommendation_response(user_query, enriched_products)

    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.post("/api/refinedrecommendations")
def refined_recommend_products(payload: RefinedRecommendationsRequest):
    """
    Endpoint for refined product recommendations based on previous query.

    Expected JSON body:
      { "new_query": "...", "original_query": "..." }
    """
    try:
        new_query = payload.new_query.strip()
        original_query = payload.original_query.strip()

        if not new_query or not original_query:
            raise HTTPException(
                status_code=400,
                detail="Both new_query and original_query are required",
            )

        user_query = refine_query(original_query, new_query)

        vector_store = app.state.vector_store
        retrieved_products = retrieve_top_products(vector_store, user_query, 5)
        enriched_products = get_enriched_products(retrieved_products)
        return format_recommendation_response(user_query, enriched_products)

    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

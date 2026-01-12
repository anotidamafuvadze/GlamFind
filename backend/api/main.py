from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Body, HTTPException

from services.vector_store import get_vector_store
from services.retrieval import retrieve_top_products
from services.enrichment import get_enriched_products
from services.format_answer import get_final_answer

BASE_DIR = Path(__file__).resolve().parents[1]
CSV_PATH = BASE_DIR / "data" / "csv" / "beautyProducts.csv"
FAISS_DIR = BASE_DIR / "vectorstores" / "faiss_beauty"


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.vector_store = get_vector_store(str(CSV_PATH), str(FAISS_DIR))
    yield

app = FastAPI(title="Product RAG API", lifespan=lifespan)


@app.post("/api/recommendations")
def recommend_products(user_query: str = Body(..., embed=False)):
    try:
        vector_store = app.state.vector_store

        top_products = retrieve_top_products(vector_store, user_query, k=8)
        enriched_products = get_enriched_products(top_products)
        final_answer = get_final_answer(user_query, enriched_products)

        return final_answer

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

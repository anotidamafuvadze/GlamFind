from services.vector_store import get_vector_store
from services.retrieval import retrieve_top_products
from services.enrichment import get_enriched_products

CSV_PATH = "GlamApp/backend/data/csv/beautyProducts.csv"
FAISS_DIR = "GlamApp/backend/vectorstores/faiss_beauty"

# TODO: Figure out how to make this a backend call

def run_build_index(user_query: str):

    # Load or create vector store
    vector_store = get_vector_store(CSV_PATH, FAISS_DIR)

    # Retrieve top products
    top_products = retrieve_top_products(vector_store, user_query, k=8)

    # Enrich products
    enriched_products = get_enriched_products(top_products)


    return enriched_products.json()


    

from services.embedding import get_embeddings
from services.vector_store import get_vector_store


CSV_PATH = "GlamApp/backend/data/csv/beautyProducts.csv"
FAISS_DIR = "GlamApp/backend/vectorstores/faiss_beauty"

def run_build_index():

    # Load or create vector store
    vector_store = get_vector_store(CSV_PATH, FAISS_DIR)

    # Retrieve top documents
    

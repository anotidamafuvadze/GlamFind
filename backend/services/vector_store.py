import os
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from services.csv_loader import get_documents


def get_vector_store(
    csv_path: str,
    faiss_dir: str,
    rebuild_index: bool = False,
) -> FAISS:
    """Initialize or load a FAISS vector store from product data.
    
    Args:
        csv_path: Path to CSV file containing product data
        faiss_dir: Directory to save/load the FAISS index
        rebuild_index: If True, force rebuild even if index exists
    
    Returns:
        Initialized FAISS vector store ready for similarity search
    """
    # Initialize embedding model
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    
    # Load existing index unless rebuild is requested
    index_exists = os.path.exists(faiss_dir)
    if index_exists and not rebuild_index:
        print(f"Loading existing FAISS index from: {faiss_dir}")
        return FAISS.load_local(
            folder_path=faiss_dir,
            embeddings=embeddings,
            allow_dangerous_deserialization=True,
        )
    
    # Build new index from CSV data
    documents = get_documents(csv_path)
    print(f"Loaded {len(documents)} product documents")
    
    # Create and save vector store
    vector_store = FAISS.from_documents(
        documents=documents,
        embedding=embeddings,
    )
    
    os.makedirs(faiss_dir, exist_ok=True)
    vector_store.save_local(folder_path=faiss_dir)
    print(f"FAISS index saved to: {faiss_dir}")
    
    return vector_store
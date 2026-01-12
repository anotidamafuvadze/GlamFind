import os
import pandas as pd
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from services.csv_loader import get_documents


def get_vector_store(
    csv_path: str,
    faiss_dir: str,
    rebuild: bool = False,
):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    # Load existing vector store if it exists
    if os.path.exists(faiss_dir) and not rebuild:
        return FAISS.load_local(
            faiss_dir,
            embeddings,
            allow_dangerous_deserialization=True,
        )
   
    documents = get_documents(csv_path)

    vector_store = FAISS.from_documents(documents, embeddings)
    os.makedirs(faiss_dir, exist_ok=True)
    vector_store.save_local(faiss_dir)

    return vector_store

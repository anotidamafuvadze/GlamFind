def retrieve_top_products(vector_store, query: str, limit: int = 5):
    """
    Retrieve the top-matching product documents from the vector store
    based on semantic similarity to the user's query.

    Args:
        vector_store: Initialized vector store instance (e.g., FAISS, Chroma)
        query: User's natural-language search query
        limit: Maximum number of results to return (default: 5)

    Returns:
        List of Document objects ranked by similarity
    """
    # Run semantic similarity search
    top_results = vector_store.similarity_search(query, k=limit)
    return top_results
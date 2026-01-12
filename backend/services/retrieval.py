def retrieve_top_products(vector_store, query: str,limit: int = 8):
    """
    Retrieve the top-matching product documents from the vector store
    based on semantic similarity to the user's query.

    Args:
        vector_store: Initialized vector store instance (e.g., FAISS, Chroma).
        query (str): User's natural-language search query.
        limit (int): Maximum number of results to return.

    Returns:
        list: A list of Document objects ranked by similarity.
    """
    # Run semantic similarity search against the vector store
    top_results = vector_store.similarity_search(query, k=limit)
    return top_results

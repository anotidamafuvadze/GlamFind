def retrieve_top_products(vectorstore, user_query: str, k: int = 5):
    top_docs = vectorstore.similarity_search(user_query, k=k)
    return top_docs
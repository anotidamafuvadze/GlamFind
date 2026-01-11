def main():
    
    # run the build pipeline once 
    vectorstore = VectorStoreService.load_chroma()

    user_query = input("What are you looking for? ")

    top_docs = RetrievalService.retrieve_top_k(user_query, k=5)

    enriched = EnrichmentService.get_enriched_products(top_docs)

    # either return directly (no LLM) or generate a nice explanation
    return enriched
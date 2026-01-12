import pandas as pd
from langchain_core.documents import Document


def get_documents(csv_path: str) -> list[Document]:
    """Load and convert CSV data into LangChain Document objects.
    
    Args:
        csv_path: Path to the CSV file containing product data
    
    Returns:
        List of Document objects with combined text content and structured metadata
    """
    # Read CSV data
    df = pd.read_csv(csv_path)
    documents = []
    
    # Convert each row to a Document
    for _, row in df.iterrows():
        # Create combined text representation for embedding/search
        document_text = (
            f"Brand: {row.get('Brand', '')}\n"
            f"Name: {row.get('Name', '')}\n"
            f"Category: {row.get('Product', '')}\n"
            f"Description: {row.get('Description', '')}"
        )
        
        # Extract structured metadata
        metadata = {
            "id": str(row.get("ID", "")),
            "brand": str(row.get("Brand", "")),
            "name": str(row.get("Name", "")),
            "product_type": str(row.get("Product", "")),
            "description": str(row.get("Description", "")),
        }
        
        documents.append(
            Document(
                page_content=document_text,
                metadata=metadata,
            )
        )
    
    return documents
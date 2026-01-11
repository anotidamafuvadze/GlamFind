import pandas as pd
from langchain_core.documents import Document

def get_documents(csv_path: str) -> list[Document]:
  df = pd.read_csv(csv_path)
  documents = []
  for _, row in df.iterrows():
      text = (
        f"Brand: {row.get('Brand','')}\n"
        f"Name: {row.get('Name','')}\n"
        f"Category: {row.get('Product','')}\n"
        f"Description: {row.get('Description','')}"
      )

      documents.append(
        Document(
            page_content=text,
            metadata={
                "id": row.get("ID"),
                "brand": row.get("Brand"),
                "name": row.get("Name"),
                "product_type": row.get("Product"),
                "description": row.get("Description"),
            },
        )
      )
  return documents

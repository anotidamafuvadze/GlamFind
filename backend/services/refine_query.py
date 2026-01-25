import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def refine_query(original_query: str, new_query: str) -> str:
    """
    Refines the original query based on the provided refinement instructions.

    Args:
        original_query (str): The initial search query.
        new_query (str): User's refinement or additional requirements.

    Returns:
        str: The refined search query optimized for product search.
    """
    
    system_prompt = """You are a query refinement assistant for a beauty product recommendation system.
Given an original search query and a refinement request, create a single, optimized search query that:
1. Incorporates the refinement details into the original query
2. Maintains search intent and context
3. Uses clear, descriptive product-focused language
4. Is concise and specific

Return ONLY the refined query text, nothing else."""

    user_prompt = f"""Original query: {original_query}
Refinement: {new_query}

Create a refined search query:"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=150
        )
        
        refined_query = response.choices[0].message.content.strip()
        print(f"Query refined: '{original_query}' + '{new_query}' -> '{refined_query}'")
        return refined_query
        
    except Exception as e:
        print(f"Error refining query with OpenAI: {e}")
        # Fallback to simple concatenation if API fails
        return f"{original_query} {new_query}"
import os
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# System prompt for query refinement
SYSTEM_PROMPT = """You are a query refinement assistant for a beauty product recommendation system.
Given an original search query and a refinement request, create a single, optimized search query that:
1. Incorporates the refinement details into the original query
2. Maintains search intent and context
3. Uses clear, descriptive product-focused language
4. Is concise and specific
Return ONLY the refined query text, nothing else."""


def refine_query(original_query: str, new_query: str) -> str:
    """
    Refines the original query based on refinement instructions using OpenAI.

    Args:
        original_query: The initial search query
        new_query: User's refinement or additional requirements

    Returns:
        The refined search query optimized for product search
    """
    user_prompt = f"""Original query: {original_query}
Refinement: {new_query}

Create a refined search query:"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=150
        )
        
        refined_query = response.choices[0].message.content.strip()
        return refined_query
        
    except Exception:
        # Fallback to simple concatenation if API call fails
        return f"{original_query} {new_query}"
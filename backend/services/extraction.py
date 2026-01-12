import json
import re
from pathlib import Path
from typing import Any, Dict, Optional

from langchain_openai import ChatOpenAI

# Configuration
LLM_MODEL = "gpt-3.5-turbo-0125"
JSON_PATTERN = re.compile(r"\{.*\}", re.DOTALL)

# Allowed fields in the final enrichment output
ALLOWED_ENRICHMENT_FIELDS = {
    "product_url",
    "image_url",
    "price",
    "rating",
    "rating_count",
    "source_name",
    "explanation",
}

# Cache for the prompt template
_PROMPT_TEMPLATE: Optional[str] = None


def extract_enrichments(
    brand: str,
    product_name: str,
    product_type: str,
    search_results: list[dict[str, Any]],
    user_query: str = "",
) -> Dict[str, Any]:
    """Extract product enrichment data from search results using LLM.
    
    Args:
        brand: Product brand name
        product_name: Product name
        product_type: Type/category of product
        search_results: List of search result dictionaries from web search
        
    Returns:
        Dictionary with normalized enrichment data
        
    Raises:
        ValueError: If required parameters are missing
    """
    # Validate required parameters
    if not brand or not product_name or not product_type:
        print("Missing required parameters for enrichment extraction")
        return {}
    
    # Prepare search results for LLM processing
    formatted_results = []
    for result in search_results or []:
        formatted_results.append(
            {
                "title": result.get("title", ""),
                "url": result.get("url", ""),
                "snippet": result.get("snippet") or result.get("content") or "",
                "score": result.get("score", 0.0),
                "source_name": result.get("source_name"),
                "raw_content": result.get("raw_content", ""),
            }
        )
    
    search_results_json = json.dumps(formatted_results, ensure_ascii=False, indent=2)
    
    # Build the prompt
    prompt_template = _get_prompt_template()
    prompt = prompt_template.format(
        brand=brand,
        product_name=product_name,
        product_type=product_type,
        search_results_json=search_results_json,
        query=user_query
    )
    
    # Initialize and call LLM
    llm = ChatOpenAI(
        model=LLM_MODEL,
        temperature=0, 
        max_tokens=1000,
    )
    
    response = llm.invoke(prompt)
    response_text = getattr(response, "content", "") or str(response)
    
    # Extract and parse JSON from LLM response
    raw_enrichment = _extract_json_from_response(response_text)
    if not raw_enrichment:
        print(f"Warning: Could not extract JSON from LLM response for {brand} {product_name}")
        return {}
    
    # Normalize the enrichment data
    normalized_enrichment = _normalize_enrichment_data(raw_enrichment)
    
    print(f"Extracted enrichment for {brand} {product_name}:")
    print(json.dumps(normalized_enrichment, indent=2))
    
    return normalized_enrichment

def _load_prompt_template(filename: str) -> str:
    """Load a prompt template from the prompts directory.
    
    Args:
        filename: Name of the prompt file
        
    Returns:
        The prompt template as a string
    """
    current_file = Path(__file__)
    prompts_dir = current_file.parent.parent / "prompts"
    prompt_path = prompts_dir / filename
    
    return prompt_path.read_text(encoding="utf-8")


def _get_prompt_template() -> str:
    """Get the prompt template, loading it once and caching it.
    
    Returns:
        The cached prompt template string
    """
    global _PROMPT_TEMPLATE
    if _PROMPT_TEMPLATE is None:
        _PROMPT_TEMPLATE = _load_prompt_template("extract_product_fields.txt")
    return _PROMPT_TEMPLATE


def _extract_json_from_response(llm_response: str) -> Optional[Dict[str, Any]]:
    """Extract and parse JSON from LLM response text.
    
    Args:
        llm_response: Raw text response from the LLM
        
    Returns:
        Parsed JSON as dictionary, or None if extraction fails
    """
    if not llm_response:
        return None
    
    # Search for JSON pattern in the response
    match = JSON_PATTERN.search(llm_response)
    if not match:
        return None
    
    json_text = match.group(0).strip()
    
    # Clean up code block formatting if present
    if json_text.startswith("```"):
        json_text = re.sub(r"^```(json)?", "", json_text).strip()
        json_text = re.sub(r"```$", "", json_text).strip()
    
    # First attempt to parse JSON
    try:
        parsed_data = json.loads(json_text)
    except json.JSONDecodeError:
        # Attempt to fix common JSON issues
        repaired_json = json_text
        repaired_json = re.sub(r",\s*}", "}", repaired_json)  # Remove trailing commas
        repaired_json = re.sub(r",\s*]", "]", repaired_json)  # Remove trailing commas in arrays
        
        try:
            parsed_data = json.loads(repaired_json)
        except json.JSONDecodeError:
            return None
    
    return parsed_data if isinstance(parsed_data, dict) else None


def _normalize_enrichment_data(enrichment_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize enrichment data to consistent types and allowed fields.
    
    Args:
        enrichment_dict: Raw enrichment data from LLM
        
    Returns:
        Cleaned dictionary with only allowed fields and normalized types
    """
    # Filter to allowed fields only
    cleaned_data: Dict[str, Any] = {
        field: enrichment_dict.get(field)
        for field in ALLOWED_ENRICHMENT_FIELDS
        if field in enrichment_dict
    }
    
    # Normalize rating count to integer
    rating_count = cleaned_data.get("rating_count")
    if rating_count is not None:
        try:
            cleaned_data["rating_count"] = int(rating_count)
        except (ValueError, TypeError):
            cleaned_data.pop("rating_count", None)
    
    # Normalize rating to float
    rating = cleaned_data.get("rating")
    if rating is not None:
        try:
            cleaned_data["rating"] = float(rating)
        except (ValueError, TypeError):
            cleaned_data.pop("rating", None)
    
    return cleaned_data
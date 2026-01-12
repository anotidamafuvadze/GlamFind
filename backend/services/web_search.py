import os
from typing import Any, Optional
from dotenv import load_dotenv
from tavily import TavilyClient

load_dotenv()
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")


def web_search(brand: str, name: str, product_type: str, k: int = 8) -> list[dict[str, Any]]:
    """Search for product information using Tavily API.
    
    Args:
        brand: Product brand name
        name: Product name
        product_type: Type/category of product
        k: Maximum number of results to return
        
    Returns:
        List of formatted search results with deduplicated URLs
        
    Raises:
        RuntimeError: If Tavily API key is not configured
    """
    # Validate API configuration
    if not TAVILY_API_KEY:
        raise RuntimeError("TAVILY_API_KEY environment variable is not set")
    
    # Initialize Tavily client
    client = TavilyClient(api_key=TAVILY_API_KEY)
    
    # Construct search query optimized for product pages
    search_query = f'"{brand}" "{name}" {product_type} product page image price rating buy'
    
    try:
        # Execute search with optimized parameters
        response = client.search(
            query=search_query,
            max_results=k,
            include_domains=None,
            exclude_domains=["wikipedia.org", "youtube.com"],
            include_answer=False,
            include_raw_content=True,
            search_depth="advanced",
        )
    except Exception as error:
        print(f"Tavily search failed for query '{search_query}': {error}")
        return []
    
    # Safely extract results from response
    if not isinstance(response, dict):
        print(f"Unexpected response type from Tavily: {type(response)}")
        return []
    
    raw_results = response.get("results", [])
    if not isinstance(raw_results, list):
        print(f"Unexpected results format: {type(raw_results)}")
        return []
    
    # Remove duplicate URLs while preserving order
    seen_urls: set[str] = set()
    unique_results: list[dict[str, Any]] = []
    
    for result in raw_results:
        if not isinstance(result, dict):
            continue
        
        url = result.get("url")
        if not url or url in seen_urls:
            continue
        
        seen_urls.add(url)
        unique_results.append(result)
    
    # Format results for downstream processing
    formatted_results: list[dict[str, Any]] = []
    
    for result in unique_results[:k]:
        url = (result.get("url") or "").strip()
        domain = _extract_domain(url)
        snippet = (result.get("content") or result.get("snippet") or "").strip()
        
        # Extract and truncate raw content if available
        raw_content = result.get("raw_content") or ""
        if isinstance(raw_content, str) and raw_content:
            raw_content = raw_content[:500]  # Limit size for processing
        
        # Safely parse relevance score
        try:
            relevance_score = float(result.get("score", 0.0) or 0.0)
        except (ValueError, TypeError):
            relevance_score = 0.0
        
        formatted_results.append({
            "title": (result.get("title") or "").strip(),
            "url": url,
            "snippet": snippet,
            "source_name": domain,
            "score": relevance_score,
            "raw_content": raw_content,
        })
    
    print(f"Web search returned {len(formatted_results)} unique results")
    return formatted_results

def _extract_domain(url: str) -> Optional[str]:
    """Extract the clean domain name from a URL.
    
    Args:
        url: Full URL string
        
    Returns:
        Domain name without 'www.' prefix, or None if invalid URL
    """
    if not url.startswith(("http://", "https://")):
        return None
    
    parts = url.split("/")
    if len(parts) > 2 and parts[2]:
        # Remove 'www.' prefix if present
        return parts[2].replace("www.", "")
    
    return None
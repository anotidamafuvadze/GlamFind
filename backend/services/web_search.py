import os
from typing import Any
from tavily import TavilyClient


def web_search(
    brand: str,
    name: str,
    product_type: str,
    k: int = 8,
) -> list[dict[str, Any]]:
    
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        raise RuntimeError("Missing TAVILY_API_KEY environment variable.")

    client = TavilyClient(api_key=api_key)

    query = f'"{brand}" "{name}" {product_type} price rating buy'

    try:
        resp = client.search(
            query=query,
            max_results=k,
            include_domains=None,
            exclude_domains=["wikipedia.org", "youtube.com"],
            include_answer=False,
            include_raw_content=True,
            search_depth="advanced",
        )
    except Exception as e:
        print(f"Warning: Tavily search failed for query {query!r}: {e}")
        return []

    raw_results = resp.get("results", []) or []

    # Deduplicate by URL (preserves order)
    seen_urls: set[str] = set()
    unique_results: list[dict[str, Any]] = []
    for r in raw_results:
        url = r.get("url")
        if not url or url in seen_urls:
            continue
        seen_urls.add(url)
        unique_results.append(r)

    # Format results
    candidates: list[dict[str, Any]] = []
    for r in unique_results[:k]:
        url = r.get("url", "") or ""

        source_name = None
        if url.startswith("http"):
            parts = url.split("/")
            if len(parts) > 2:
                source_name = parts[2]

        raw_content = r.get("raw_content") or ""

        candidates.append(
            {
                "title": r.get("title", "") or "",
                "url": url,
                "snippet": r.get("content") or r.get("snippet") or "",
                "source_name": source_name,
                "score": float(r.get("score", 0.0) or 0.0),
                "raw_content": raw_content[:500] if raw_content else "",
            }
        )

    return candidates

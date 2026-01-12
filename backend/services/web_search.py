import os
from typing import Any, Optional
from tavily import TavilyClient


def _get_domain(url: str) -> Optional[str]:
    if not url.startswith("http"):
        return None
    parts = url.split("/")
    if len(parts) > 2 and parts[2]:
        return parts[2].replace("www.", "")
    return None


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

    # Defensive: Tavily should return a dict, but don't assume forever
    raw_results = resp.get("results", []) if isinstance(resp, dict) else []
    raw_results = raw_results or []

    # Deduplicate by URL (preserves order)
    seen_urls: set[str] = set()
    unique_results: list[dict[str, Any]] = []
    for r in raw_results:
        if not isinstance(r, dict):
            continue
        url = r.get("url")
        if not url or url in seen_urls:
            continue
        seen_urls.add(url)
        unique_results.append(r)

    # Format results
    candidates: list[dict[str, Any]] = []
    for r in unique_results[:k]:
        url = (r.get("url") or "").strip()
        source_name = _get_domain(url)
        snippet = (r.get("content") or r.get("snippet") or "").strip()
        raw_content = r.get("raw_content") or ""

        if isinstance(raw_content, str) and raw_content:
            raw_content = raw_content[:500]
        else:
            raw_content = ""

        try:
            score = float(r.get("score", 0.0) or 0.0)
        except (TypeError, ValueError):
            score = 0.0

        candidates.append(
            {
                "title": (r.get("title") or "").strip(),
                "url": url,
                "snippet": snippet,
                "source_name": source_name,
                "score": score,
                "raw_content": raw_content,
            }
        )

    return candidates

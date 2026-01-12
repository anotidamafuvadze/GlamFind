import json
import re
from typing import Any, Optional, Dict

from importlib.resources import files
from langchain_openai import ChatOpenAI

LLM_MODEL = "gpt-3.5-turbo-0125"
JSON_PATTERN = re.compile(r"\{.*\}", re.DOTALL)

# Load once (faster + avoids repeated filesystem reads)
PROMPT_TEMPLATE = None

ALLOWED_ENRICHMENT_KEYS = {
    "product_url",
    "image_url",
    "price",
    "rating",
    "rating_count",
    "source_name",
}


def _load_prompt_template(filename: str) -> str:
    path = files("backend.prompts").joinpath(filename)
    return path.read_text(encoding="utf-8")


def _get_prompt_template() -> str:
    global PROMPT_TEMPLATE
    if PROMPT_TEMPLATE is None:
        PROMPT_TEMPLATE = _load_prompt_template("extract_product_fields.txt")
    return PROMPT_TEMPLATE


def _extract_json(text: str) -> Optional[Dict[str, Any]]:
    if not text:
        return None

    match = JSON_PATTERN.search(text)
    if not match:
        return None

    json_str = match.group(0).strip()

    # Remove fenced code blocks if the model ignored instructions
    if json_str.startswith("```"):
        json_str = re.sub(r"^```(json)?", "", json_str).strip()
        json_str = re.sub(r"```$", "", json_str).strip()

    # First pass parse
    try:
        parsed = json.loads(json_str)
    except json.JSONDecodeError:
        repaired = json_str
        repaired = re.sub(r",\s*}", "}", repaired)
        repaired = re.sub(r",\s*]", "]", repaired)
        try:
            parsed = json.loads(repaired)
        except json.JSONDecodeError:
            return None

    return parsed if isinstance(parsed, dict) else None


def _normalize_enrichment(enhancements: Dict[str, Any]) -> Dict[str, Any]:
    """
    Keep the output lean and consistent for your dict-based enrichment pipeline + caching.
    This does NOT enforce rating bounds; your enrichment file already does that.
    """
    clean: Dict[str, Any] = {k: enhancements.get(k) for k in ALLOWED_ENRICHMENT_KEYS if k in enhancements}

    # Optional small normalizations (safe):
    # - rating_count should be int if possible
    if "rating_count" in clean and clean["rating_count"] is not None:
        try:
            clean["rating_count"] = int(clean["rating_count"])
        except (TypeError, ValueError):
            clean.pop("rating_count", None)

    # - rating should be float if possible
    if "rating" in clean and clean["rating"] is not None:
        try:
            clean["rating"] = float(clean["rating"])
        except (TypeError, ValueError):
            clean.pop("rating", None)

    return clean


def extract_enrichments(
    brand: str,
    product_name: str,
    product_type: str,
    search_results: list[dict[str, Any]],
) -> Dict[str, Any]:
    """
    Returns a plain dict (JSON-like) with keys like:
      product_url, image_url, price, rating, rating_count, source_name

    This is compatible with:
      extracted = extract_enrichments(brand, name, product_type, candidates)
    in your enrichment file.
    """
    if not brand or not product_name or not product_type:
        raise ValueError("brand, product_name, and product_type are required")
    
    lean_results = [
        {
            "title": r.get("title", ""),
            "url": r.get("url", ""),
            "snippet": r.get("snippet") or r.get("content") or "",
            "score": r.get("score", 0.0),
            "source_name": r.get("source_name"),
        }
        for r in (search_results or [])
    ]

    search_results_json = json.dumps(lean_results, ensure_ascii=False, indent=2)

    prompt_template = _get_prompt_template()
    prompt = prompt_template.format(
        brand=brand,
        product_name=product_name,
        product_type=product_type,
        search_results_json=search_results_json,
    )

    llm = ChatOpenAI(
        model=LLM_MODEL,
        temperature=0,
        max_tokens=1000,
    )

    resp = llm.invoke(prompt)
    text = getattr(resp, "content", "") or str(resp)

    enhancements = _extract_json(text)
    if not enhancements:
        raise ValueError("Failed to extract a valid JSON object from the LLM response.")

    return _normalize_enrichment(enhancements)

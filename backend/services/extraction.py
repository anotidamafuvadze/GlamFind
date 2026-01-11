import json
import re
from typing import Any, Optional
from importlib.resources import files
from langchain_openai import ChatOpenAI


JSON_PATTERN = re.compile(r"\{.*\}", re.DOTALL)

def _load_prompt_template(filename: str) -> str:
    path = files("backend.prompts").joinpath(filename)
    return path.read_text(encoding="utf-8")


def _extract_json(text: str) -> Optional[dict[str, Any]]:
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
        return json.loads(json_str)
    except json.JSONDecodeError:
        repaired = json_str
        repaired = re.sub(r",\s*}", "}", repaired)
        repaired = re.sub(r",\s*]", "]", repaired)
        try:
            return json.loads(repaired)
        except json.JSONDecodeError:
            return None


def extract_enrichments(
    brand: str,
    product_name: str,
    product_type: str,
    search_results: list[dict[str, Any]],
) -> dict[str, Any]:
    
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

    PROMPT_TEMPLATE = _load_prompt_template("extract_product_fields.txt")
    prompt = PROMPT_TEMPLATE.format(
        brand=brand,
        product_name=product_name,
        product_type=product_type,
        search_results_json=search_results_json,
    )

    llm = ChatOpenAI(
        model="gpt-3.5-turbo-0125",
        temperature=0,
        max_tokens=1000,
    )

    resp = llm.invoke(prompt)
    text = getattr(resp, "content", "") or str(resp)

    enhancements = _extract_json(text)
    if not enhancements or not isinstance(enhancements, dict):
        raise ValueError("Failed to extract a valid JSON object from the LLM response.")

    return enhancements

    # Example output:
    # {
    #   "product_url": "https://www.sephora.com/product/soft-pinch-liquid-blush-P979897",
    #   "image_url": "https://www.sephora.com/productimages/sku/s2474568-main-zoom.jpg",
    #   "price": "$25.00",
    #   "rating": 4.6,
    #   "rating_count": 12000,
    #   "source_name": "sephora.com"
    # }


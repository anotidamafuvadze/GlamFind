from __future__ import annotations

import ipaddress
import logging
import re
from urllib.parse import unquote, urlparse

import httpx
from fastapi import APIRouter, HTTPException, Query, Request, Response
from starlette.responses import StreamingResponse

router = APIRouter()

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("image_proxy")

# ---------------------------------------------------------------------
# Allowlist
# ---------------------------------------------------------------------
# Your enrichment sources (per the code you shared) are primarily:
# - Amazon (m.media-amazon.com + ssl-images)
# - eBay (i.ebayimg.com + other *.ebayimg.com)
# - Walmart (i5.walmartimages.com + sometimes other walmart cdn hosts)
# - Google Shopping thumbnails (can vary, but often gstatic / googleusercontent)
#
# For safety: keep this tight. Add more only as you encounter them in logs.
# ---------------------------------------------------------------------

ALLOWED_HOSTS = {
    # Amazon
    "m.media-amazon.com",
    "images-na.ssl-images-amazon.com",
    "images-eu.ssl-images-amazon.com",
    "images.amazon.com",

    # Walmart
    "i5.walmartimages.com",

    # eBay
    "i.ebayimg.com",

    # Target / Ulta / Sephora (if you still use them)
    "target.scene7.com",
    "media.ulta.com",
    "www.sephora.com",

    # Example
    "static.zara.net",
}

# Allow subdomains for common CDNs used by these providers
ALLOWED_HOST_SUFFIXES = {
    # Amazon
    ".media-amazon.com",
    ".ssl-images-amazon.com",

    # eBay images (covers i.ebayimg.com and any other subdomain)
    ".ebayimg.com",

    # Walmart sometimes uses additional subdomains in the wild
    ".walmartimages.com",

    # Google Shopping thumbnails can come from these (tight but practical)
    ".gstatic.com",
    ".googleusercontent.com",
}

# Only proxy images
IMAGE_CT_PREFIXES = ("image/",)

# Safety limits
MAX_BYTES = 10 * 1024 * 1024  # 10MB cap
UPSTREAM_TIMEOUT_S = 12.0

# Cache headers
CACHE_CONTROL = "public, max-age=604800, s-maxage=604800, immutable"  # 7 days

# Optional heuristic (warning only)
IMAGE_EXT_RE = re.compile(
    r"\.(jpg|jpeg|png|webp|gif|avif|svg|bmp|tiff)(\?|$)",
    re.IGNORECASE,
)


def _is_allowed_host(host: str) -> bool:
    host = host.lower().strip()
    if host in ALLOWED_HOSTS:
        return True
    return any(host.endswith(suf) for suf in ALLOWED_HOST_SUFFIXES)


def _is_private_or_local_ip(host: str) -> bool:
    """
    Prevent SSRF to private networks by blocking literal IP hosts.
    Note: this does NOT DNS-resolve hostnames; it only blocks literal IPs.
    """
    try:
        ip = ipaddress.ip_address(host)
        return (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_reserved
            or ip.is_multicast
        )
    except ValueError:
        return False


def _validate_url(raw_url: str) -> str:
    if not raw_url or not isinstance(raw_url, str):
        raise HTTPException(status_code=400, detail="Missing url")

    # url may already be percent-encoded from the client
    url = unquote(raw_url).strip()
    parsed = urlparse(url)

    # require https only
    if parsed.scheme != "https":
        raise HTTPException(status_code=400, detail="Only https URLs are allowed")

    host = (parsed.hostname or "").strip()
    if not host:
        raise HTTPException(status_code=400, detail="Invalid URL host")

    if _is_private_or_local_ip(host):
        raise HTTPException(status_code=400, detail="IP hosts are not allowed")

    if not _is_allowed_host(host):
        raise HTTPException(status_code=403, detail=f"Host not allowed: {host}")

    # Optional warning only (do NOT block)
    if parsed.path and not IMAGE_EXT_RE.search(parsed.path):
        logger.warning("URL path does not match image extensions: %s", parsed.path)

    return url


async def _stream_with_limit(resp: httpx.Response):
    total = 0
    async for chunk in resp.aiter_bytes():
        total += len(chunk)
        if total > MAX_BYTES:
            raise HTTPException(status_code=413, detail="Image too large")
        yield chunk


def _copy_cache_headers(upstream: httpx.Response, response_headers: dict) -> None:
    etag = upstream.headers.get("etag")
    last_modified = upstream.headers.get("last-modified")

    if etag:
        response_headers["ETag"] = etag
    if last_modified:
        response_headers["Last-Modified"] = last_modified

    response_headers["Cache-Control"] = CACHE_CONTROL
    response_headers["Vary"] = "Accept-Encoding"


@router.api_route("/image-proxy", methods=["GET", "HEAD"])
async def image_proxy(
    request: Request,
    url: str = Query(..., description="Upstream https image URL (percent-encoded ok)"),
):
    """
    Mounted in main.py with prefix="/api"
    => final path: /api/image-proxy?url=...
    """
    upstream_url = _validate_url(url)

    forward_headers = {
        "User-Agent": request.headers.get("user-agent", "Mozilla/5.0"),
        "Accept": request.headers.get("accept", "image/*,*/*;q=0.8"),
    }

    async with httpx.AsyncClient(
        follow_redirects=True,
        timeout=httpx.Timeout(UPSTREAM_TIMEOUT_S),
    ) as client:
        try:
            # HEAD handling
            if request.method == "HEAD":
                upstream = await client.head(upstream_url, headers=forward_headers)
                if upstream.status_code >= 400:
                    # some servers don't support HEAD properly
                    upstream = await client.get(upstream_url, headers=forward_headers)

                ct = (upstream.headers.get("content-type") or "").lower()
                if not ct.startswith(IMAGE_CT_PREFIXES):
                    raise HTTPException(status_code=415, detail=f"Upstream is not an image: {ct}")

                headers: dict = {"Content-Type": upstream.headers.get("content-type", "image/jpeg")}
                _copy_cache_headers(upstream, headers)

                if upstream.status_code == 304:
                    return Response(status_code=304, headers=headers)

                return Response(status_code=200, headers=headers)

            # GET handling (stream)
            upstream = await client.get(upstream_url, headers=forward_headers)

            if upstream.status_code == 304:
                headers: dict = {}
                _copy_cache_headers(upstream, headers)
                return Response(status_code=304, headers=headers)

            if upstream.status_code != 200:
                raise HTTPException(status_code=502, detail=f"Upstream status {upstream.status_code}")

            ct = (upstream.headers.get("content-type") or "").lower()
            if not ct.startswith(IMAGE_CT_PREFIXES):
                raise HTTPException(status_code=415, detail=f"Upstream is not an image: {ct}")

            headers: dict = {"Content-Type": upstream.headers.get("content-type", "image/jpeg")}
            _copy_cache_headers(upstream, headers)

            return StreamingResponse(
                _stream_with_limit(upstream),
                status_code=200,
                headers=headers,
            )

        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Upstream timed out")
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Upstream error: {str(e)}")

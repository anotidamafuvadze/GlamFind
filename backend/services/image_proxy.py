from __future__ import annotations

import ipaddress
import re
from typing import Optional
from urllib.parse import urlparse, unquote

import httpx
from fastapi import APIRouter, HTTPException, Query, Response, Request
from starlette.responses import StreamingResponse

router = APIRouter()

# ✅ Allowlist of hostnames you permit (add/remove as you like)
ALLOWED_HOSTS = {
    "m.media-amazon.com",
    "images-na.ssl-images-amazon.com",
    "images.amazon.com",
    "images-eu.ssl-images-amazon.com",
    "i5.walmartimages.com",
    "target.scene7.com",
    "media.ulta.com",
    "www.sephora.com",
    "static.zara.net",  # example
}

# Optional: allow subdomains of these (e.g. cdn.foo.com). Keep tight.
ALLOWED_HOST_SUFFIXES = {
    ".media-amazon.com",
    ".ssl-images-amazon.com",
}

# Block common non-image content-types if you want (optional)
IMAGE_CT_PREFIXES = ("image/",)

# Safety limits
MAX_BYTES = 10 * 1024 * 1024  # 10MB cap
UPSTREAM_TIMEOUT_S = 12.0

# Caching policy (tune as desired)
# public: allow CDN/browser caching
# max-age: seconds cache fresh
# s-maxage: seconds for shared caches/CDNs
CACHE_CONTROL = "public, max-age=604800, s-maxage=604800, immutable"  # 7 days

# Accept common image extensions quickly (optional heuristic)
IMAGE_EXT_RE = re.compile(r"\.(jpg|jpeg|png|webp|gif|avif)(\?|$)", re.IGNORECASE)


def _is_allowed_host(host: str) -> bool:
    host = host.lower().strip()
    if host in ALLOWED_HOSTS:
        return True
    return any(host.endswith(suf) for suf in ALLOWED_HOST_SUFFIXES)


def _is_private_or_local_ip(host: str) -> bool:
    """
    Prevent SSRF to private networks by resolving literal IPs.
    (We are not doing DNS resolution here; if you want to be extra strict,
    you can resolve DNS and check returned IPs too.)
    """
    try:
        ip = ipaddress.ip_address(host)
        return ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved or ip.is_multicast
    except ValueError:
        return False  # not a literal IP


def _validate_url(raw_url: str) -> str:
    if not raw_url or not isinstance(raw_url, str):
        raise HTTPException(status_code=400, detail="Missing url")

    # allow url to be percent-encoded from the client
    url = unquote(raw_url).strip()

    parsed = urlparse(url)
    if parsed.scheme not in ("https",):
        raise HTTPException(status_code=400, detail="Only https URLs are allowed")

    host = (parsed.hostname or "").strip()
    if not host:
        raise HTTPException(status_code=400, detail="Invalid URL host")

    if _is_private_or_local_ip(host):
        raise HTTPException(status_code=400, detail="IP hosts are not allowed")

    if not _is_allowed_host(host):
        raise HTTPException(status_code=403, detail=f"Host not allowed: {host}")

    # Optional: quick heuristic to reject obviously non-image URLs
    # (You can remove this if you need to proxy image URLs without extensions.)
    if parsed.path and not IMAGE_EXT_RE.search(parsed.path):
        # Amazon images usually have .jpg/.png; if not, you can loosen this.
        pass

    return url


async def _stream_with_limit(resp: httpx.Response):
    total = 0
    async for chunk in resp.aiter_bytes():
        total += len(chunk)
        if total > MAX_BYTES:
            raise HTTPException(status_code=413, detail="Image too large")
        yield chunk


def _copy_cache_headers(upstream: httpx.Response, response_headers: dict) -> None:
    # If upstream already has strong caching, you can choose to honor it.
    # Here we apply our own Cache-Control but preserve ETag/Last-Modified when present.
    etag = upstream.headers.get("etag")
    last_modified = upstream.headers.get("last-modified")

    if etag:
        response_headers["ETag"] = etag
    if last_modified:
        response_headers["Last-Modified"] = last_modified

    response_headers["Cache-Control"] = CACHE_CONTROL
    # Helps some caches identify content
    response_headers["Vary"] = "Accept-Encoding"


@router.api_route("/image-proxy", methods=["GET", "HEAD"])
async def image_proxy(
    request: Request,
    url: str = Query(..., description="Upstream https image URL (percent-encoded ok)"),
):
    upstream_url = _validate_url(url)

    # If client sends conditional headers, forward them upstream to support 304s
    forward_headers = {
        "User-Agent": request.headers.get("user-agent", "Mozilla/5.0"),
        "Accept": request.headers.get("accept", "image/*,*/*;q=0.8"),
    }
    if "if-none-match" in request.headers:
        forward_headers["If-None-Match"] = request.headers["if-none-match"]
    if "if-modified-since" in request.headers:
        forward_headers["If-Modified-Since"] = request.headers["if-modified-since"]

    async with httpx.AsyncClient(
        follow_redirects=True,
        timeout=httpx.Timeout(UPSTREAM_TIMEOUT_S),
    ) as client:
        try:
            # HEAD first if this is a HEAD request
            if request.method == "HEAD":
                upstream = await client.head(upstream_url, headers=forward_headers)
                # Some hosts don’t support HEAD properly; fall back to GET metadata-only
                if upstream.status_code >= 400:
                    upstream = await client.get(upstream_url, headers=forward_headers)

                ct = (upstream.headers.get("content-type") or "").lower()
                if not ct.startswith(IMAGE_CT_PREFIXES):
                    raise HTTPException(status_code=415, detail=f"Upstream is not an image: {ct}")

                headers: dict = {"Content-Type": upstream.headers.get("content-type", "image/jpeg")}
                _copy_cache_headers(upstream, headers)

                # Respect upstream 304
                if upstream.status_code == 304:
                    return Response(status_code=304, headers=headers)

                return Response(status_code=200, headers=headers)

            # GET request: stream content
            upstream = await client.get(upstream_url, headers=forward_headers)
            # Respect upstream 304
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

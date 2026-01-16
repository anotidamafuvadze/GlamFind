# Product API Enrichment Setup Guide

## Overview
Your app now uses **product-specific APIs** to fetch product images, prices, and ratings instead of relying solely on web scraping. This provides:
- ✅ Reliable product images
- ✅ Accurate pricing data
- ✅ Customer ratings and reviews
- ✅ Faster response times

## Quick Start (Recommended: SerpAPI)

### 1. Sign up for SerpAPI (100 free searches/month)
```bash
# 1. Visit https://serpapi.com/
# 2. Sign up for a free account
# 3. Get your API key from the dashboard
```

### 2. Add API key to your .env file
```bash
# In backend/.env (create if doesn't exist)
SERPAPI_KEY=your_actual_serpapi_key_here
```

### 3. Restart your backend server
```bash
cd backend
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

That's it! Your app will now fetch product images from real e-commerce sources.

---

## Alternative API Providers

### Option 1: Google Custom Search API
**Best for**: High volume, more control
**Free tier**: 100 queries/day
**Setup**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Custom Search API
3. Get your API key
4. Create a [Custom Search Engine](https://programmablesearchengine.google.com/)
5. Enable "Image Search" in settings
6. Add to .env:
   ```
   GOOGLE_SHOPPING_API_KEY=your_key
   GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_cse_id
   ```

### Option 2: RapidAPI Product Search
**Best for**: Multiple data sources
**Free tier**: Varies by API (usually 100-500 requests/month)
**Setup**:
1. Visit [RapidAPI Marketplace](https://rapidapi.com/search/product)
2. Subscribe to "Real-Time Product Search" or similar API
3. Get your API key
4. Add to .env:
   ```
   RAPIDAPI_KEY=your_rapidapi_key
   ```

---

## How It Works

### Enrichment Strategy (Automatic Fallback)
```
1. Try Product APIs first (SerpAPI → Google → RapidAPI)
   ↓ Success? Return product data with images
   ✓ Yes → Done!
   ✗ No → Continue to step 2

2. Fallback to Web Search + LLM extraction
   ↓ (Your original method)
   
3. Cache results to avoid repeated API calls
```

### What You Get From APIs
```json
{
  "product_url": "https://sephora.com/product/...",
  "image_url": "https://cdn.sephora.com/image.jpg",
  "price": "$49.99",
  "rating": 4.5,
  "rating_count": 1234,
  "source_name": "sephora.com",
  "explanation": "Product description..."
}
```

---

## Cost Comparison

| Provider | Free Tier | Cost After Free | Image Quality |
|----------|-----------|-----------------|---------------|
| **SerpAPI** (Recommended) | 100/month | $50/5k searches | ⭐⭐⭐⭐⭐ Excellent |
| Google Custom Search | 100/day | $5/1k queries | ⭐⭐⭐⭐ Very Good |
| RapidAPI | Varies | Varies by API | ⭐⭐⭐⭐ Good |
| Web Search (fallback) | Unlimited | LLM costs only | ⭐⭐ Limited |

---

## Testing

Test your API setup:
```bash
# Make a search request
curl -X POST http://localhost:8000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '"lightweight moisturizer"'
```

Check the logs - you should see:
```
[PRODUCT_API] Trying SerpAPI Shopping for: Brand Product Type
[PRODUCT_API] ✓ Found product data from SerpAPI Shopping
[API] Successfully enriched product 123 via API
```

---

## Troubleshooting

### No images showing up?
1. Check your .env file has the API key
2. Verify the key works: https://serpapi.com/dashboard
3. Check logs for `[PRODUCT_API]` messages
4. Ensure backend server was restarted after adding .env

### API quota exceeded?
- The system automatically falls back to web search
- Consider upgrading API plan or adding multiple providers
- Cached results don't count toward quota

### Wrong products returned?
- APIs return best matches based on search query
- Your brand/name/type data quality affects results
- Consider adding more specific product details to your CSV data

---

## Production Recommendations

1. **Use SerpAPI for MVP** (100 free searches/month covers testing)
2. **Monitor usage** in your API dashboard
3. **Enable caching** (already implemented via SQLite)
4. **Add multiple providers** for redundancy
5. **Consider dedicated beauty APIs** (e.g., Sephora/Ulta if they offer APIs)

---

## Support

- SerpAPI Docs: https://serpapi.com/google-shopping-api
- Google CSE Docs: https://developers.google.com/custom-search
- RapidAPI Marketplace: https://rapidapi.com/

Need help? Check the logs for detailed error messages from each provider.

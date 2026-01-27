# LuxeFind (iOS)

## Overview

**LuxeFind** is an iOS application that enables **AI-powered product discovery** using **semantic search** rather than keyword filtering. Users can search naturally (e.g., *“hydrating lipstick for dry skin”*), and LuxeFind retrieves the most relevant beauty products using vector embeddings and similarity search.

The app integrates **LangChain embeddings**, **FAISS vector indexing**, and a **PostgreSQL-backed metadata store** to support fast, accurate retrieval across ~10,000 real-world beauty products.

---

## Features

### Semantic Search

* Natural-language queries powered by dense embeddings.
* Results ranked by semantic similarity instead of keyword matching.
* Supports nuanced, intent-based product discovery.

### AI-Powered Retrieval Pipeline

* Product data transformed into embedding-ready documents.
* FAISS vector index enables low-latency similarity search.
* Indices are persisted locally to avoid recomputation.

### Product Enrichment

* Automated pipeline retrieves:

  * Live prices
  * Ratings and review counts
  * Product images
  * Retailer links
* Keeps results accurate and up to date.

### User Accounts & Favorites

* Secure authentication via Supabase.
* Users can save and manage favorite products.
* Favorites persist across sessions and devices.

### Performance & Caching

* Local FAISS index minimizes query latency.
* Cached product metadata reduces API calls.
* Designed for scalable, cost-efficient retrieval.

---

## Tech Stack

### Frameworks

* React Native (Expo)
* TypeScript

### Backend & Data

* Python
* LangChain
* FAISS (vector similarity search)
* PostgreSQL (Supabase)

### AI & Search

* OpenAI embeddings
* Vector-based semantic search
* Hybrid structured + unstructured querying

### Storage & Auth

* Supabase Auth
* Supabase PostgreSQL
* Local embedding and query caching

---

## Architecture & Data Flow

### Data Ingestion

* Product data is loaded from structured CSV sources.
* Each product is converted into a document containing:

  * Name
  * Brand
  * Description
  * Price
  * Ratings
  * Metadata

### Embedding & Indexing

* Documents are embedded using an LLM embedding model.
* Vectors are stored in a FAISS index.
* Index is persisted locally for fast reuse.

```text
CSV → Document → Embedding → FAISS Index
```

### Query Flow

1. User submits a natural-language query.
2. Query is embedded.
3. FAISS retrieves the most similar vectors.
4. Matching products are joined with PostgreSQL metadata.
5. Ranked results are returned to the app.

### Enrichment Layer

* Background jobs retrieve:

  * Prices
  * Ratings
  * Images
* Results are cached to minimize repeated API calls.

---

## Database Design

### Products Table

* `id`
* `name`
* `brand`
* `price`
* `rating`
* `image_url`
* `source`
* `external_id`

### Favorites Table

* `user_id`
* `product_id`
* `created_at`

Supports secure, user-scoped access using Supabase Row Level Security (RLS).

---

## How the App Works

* **Start:** App loads the FAISS index and product metadata.
* **Search:** User enters a natural-language query.
* **Retrieve:** Semantic search returns relevant products.
* **Explore:** Users view details and save favorites.
* **Persist:** Favorites and preferences are stored securely.

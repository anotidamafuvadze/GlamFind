import { Platform } from "react-native";

// Environment variable for API URL
const ENV_API_URL = process.env.EXPO_PUBLIC_API_URL;

// Local development fallback URLs
const LOCAL_FALLBACK_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8000"
    : "http://localhost:8000";

// Base API URL with trailing slash cleanup
//export const API_BASE_URL = (ENV_API_URL ?? LOCAL_FALLBACK_URL).replace(/\/+$/, "");
export const API_BASE_URL = "https://luxefind.onrender.com";


/**
 * Generic JSON request helper for API calls
 * 
 * @param path - API endpoint path
 * @param body - Request body data
 * @param init - Additional fetch options
 * @returns Promise with parsed JSON response
 * @throws Error when request fails
 */
async function requestJson<T>(
  path: string,
  body: unknown,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    body: JSON.stringify(body),
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${res.statusText} ${text}`);
  }

  return (await res.json()) as T;
}

/**
 * Fetch initial product recommendations based on search query
 * 
 * @param query - User's search input
 * @returns Promise with recommendation data
 */
export async function fetchRecommendations(query: string) {
  return requestJson("/api/recommendations", { query });
}

/**
 * Fetch refined product recommendations based on previous query
 * 
 * @param new_query - User's refinement or follow-up query
 * @param original_query - Original search query for context
 * @returns Promise with refined recommendation data
 */
export async function fetchRefinedRecommendations(
  new_query: string,
  original_query: string,
) {
  return requestJson("/api/refinedrecommendations", {
    new_query,
    original_query,
  });
}
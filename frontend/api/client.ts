import { Platform } from "react-native";

// Prefer the env var (works in production builds + Expo)
const ENV_API_URL = process.env.EXPO_PUBLIC_API_URL;

// Sensible local fallback if env var missing
const LOCAL_FALLBACK_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8000"
    : "http://localhost:8000";

export const API_BASE_URL = (ENV_API_URL ?? LOCAL_FALLBACK_URL).replace(/\/+$/, "");

async function requestJson<T>(
  path: string,
  body: unknown,
  init?: RequestInit
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

export async function fetchRecommendations(query: string) {
  return requestJson("/api/recommendations", { query });
}

export async function fetchRefinedRecommendations(
  new_query: string,
  original_query: string
) {
  return requestJson("/api/refinedrecommendations", {
    new_query,
    original_query,
  });
}

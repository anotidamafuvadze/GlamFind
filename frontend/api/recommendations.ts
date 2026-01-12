import { Platform } from "react-native";

/**
 * Fetches product recommendations from the API based on a search query
 * 
 * @param query - User's search input
 * @returns Promise with recommendation data including query and products list
 * @throws Error when API request fails
 */

// TODO: Verify that this works when deployed on actual devices

const API_BASE_URL = Platform.select({
  ios: "http://localhost:8000",
  android: "http://10.0.2.2:8000",
  default: "http://localhost:8000",
});

export async function fetchRecommendations(query: string) {
  console.log('Sending query:', query);
  
  const res = await fetch(`${API_BASE_URL}/api/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  // console.log("Parsed API data:", JSON.stringify(data, null, 2));
  return data;
}
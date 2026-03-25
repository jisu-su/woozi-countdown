import { toMealsByDate } from "./meals.adapter.js";

/**
 * Meals service (network layer).
 *
 * This file is where you will integrate a real public API.
 *
 * Current behavior:
 * - Calls a placeholder URL
 * - Converts the JSON response using `meals.adapter.js`
 *
 * What you should implement next (when you pick an API):
 * 1) Replace `https://example.com/meals` with the real endpoint.
 * 2) Add your authentication (API key header or query param).
 * 3) Implement caching (meals_cache_YYYY-MM) and timeout.
 * 4) Keep return shape compatible with `meals.controller.js`:
 *    { "YYYY-MM-DD": { menu: "..." } }
 */
export async function fetchMealsByMonth({ year, month }) {
  // TODO: 공공데이터 API URL/KEY로 교체하세요.
  // month는 1~12 기준으로 전달 권장.
  const url = new URL("https://example.com/meals");
  url.searchParams.set("year", String(year));
  url.searchParams.set("month", String(month));

  // Fetch the API and parse JSON.
  const response = await fetch(url);
  if (!response.ok) {
    // Throw so the caller (bootstrap) can decide fallback usage.
    throw new Error("Failed to fetch meals");
  }

  const raw = await response.json();
  // Transform API response into internal format.
  return toMealsByDate(raw);
}

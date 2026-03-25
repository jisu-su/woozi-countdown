import { toMealsByDate } from "./meals.adapter.js";

export async function fetchMealsByMonth({ year, month }) {
  // TODO: 공공데이터 API URL/KEY로 교체하세요.
  // month는 1~12 기준으로 전달 권장.
  const url = new URL("https://example.com/meals");
  url.searchParams.set("year", String(year));
  url.searchParams.set("month", String(month));

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch meals");
  }

  const raw = await response.json();
  return toMealsByDate(raw);
}

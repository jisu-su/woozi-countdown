import { toMealsByDate } from "./meals.adapter.js";

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;

function toYearMonth({ year, month }) {
  return `${year}${String(month).padStart(2, "0")}`;
}

function toCacheKey(ym) {
  return `meals_cache_${ym.slice(0, 4)}-${ym.slice(4, 6)}`;
}

function readCache(ym) {
  try {
    const cached = localStorage.getItem(toCacheKey(ym));
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    if (!parsed?.fetchedAt || !parsed?.data) return null;

    const age = Date.now() - Number(parsed.fetchedAt);
    if (age > CACHE_TTL_MS) return null;

    return parsed.data;
  } catch (error) {
    console.warn("Failed to read meals cache", error);
    return null;
  }
}

function writeCache(ym, data) {
  try {
    localStorage.setItem(
      toCacheKey(ym),
      JSON.stringify({
        fetchedAt: Date.now(),
        data,
      }),
    );
  } catch (error) {
    console.warn("Failed to write meals cache", error);
  }
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        accept: "application/xml,text/xml,*/*",
      },
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchMealsByMonth({ year, month, useCache = true }) {
  const ym = toYearMonth({ year, month });

  if (useCache) {
    const cached = readCache(ym);
    if (cached) return cached;
  }

  const response = await fetchWithTimeout(`/api/meals?ym=${ym}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch meals: ${response.status}`);
  }

  const rawXml = await response.text();
  const data = toMealsByDate(rawXml);

  if (!Object.keys(data).length) {
    throw new Error("Meals API returned no rows");
  }

  writeCache(ym, data);
  return data;
}

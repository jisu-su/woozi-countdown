/**
 * Meals adapter.
 *
 * Role:
 * - Convert an arbitrary public API response into this project's internal format
 *   so `meals.view.js` can render the weekly calendar.
 *
 * Internal format expected by `meals.view.js`:
 * {
 *   "YYYY-MM-DD": { menu: "메뉴1, 메뉴2, ..." }
 * }
 *
 * Notes for you (when you plug in a real API):
 * - You only need to adjust the adapter mapping rules.
 * - Keep the RETURN SHAPE exactly the same (date-keyed object map).
 */
export function toMealsByDate(apiResponse) {
  // 내부 포맷(예시):
  // {
  //   "2026-02-01": { menu: "..." }
  // }

  // Defensive: always return an object map.
  if (!apiResponse) return {};

  // 1) If the response already looks like the internal format, return it.
  if (typeof apiResponse === "object" && !Array.isArray(apiResponse)) {
    const keys = Object.keys(apiResponse);
    if (keys.length && keys.every((k) => /^\d{4}-\d{2}-\d{2}$/.test(k))) {
      const looksLikeInternal = apiResponse[keys[0]] && typeof apiResponse[keys[0]].menu !== "undefined";
      if (looksLikeInternal) return apiResponse;
    }
  }

  // 2) Otherwise, find an array of records inside the response.
  // Many APIs use one of these common top-level keys.
  const records =
    (Array.isArray(apiResponse) && apiResponse) ||
    apiResponse.items ||
    apiResponse.data ||
    apiResponse.result ||
    apiResponse.meals ||
    [];

  if (!Array.isArray(records)) return {};

  // Convert menu-like values into a string.
  // The view later splits by regex: `[,/]` to create individual lines.
  const normalizeMenuToString = (menu) => {
    if (!menu) return "";
    if (typeof menu === "string") return menu;
    if (Array.isArray(menu)) return menu.map((x) => String(x)).join(", ");
    if (typeof menu === "object") {
      if (Array.isArray(menu.menu)) return menu.menu.map((x) => String(x)).join(", ");
      if (Array.isArray(menu.dishes)) return menu.dishes.map((x) => String(x)).join(", ");
    }
    return String(menu);
  };

  // Convert different date representations into `YYYY-MM-DD`.
  const normalizeDateToYYYYMMDD = (dateVal) => {
    if (!dateVal) return null;
    const s = String(dateVal);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    if (/^\d{8}$/.test(s)) return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;

    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return null;
    // Date 전용 값으로 처리 (로컬 타임존 이슈 최소화)
    return d.toISOString().slice(0, 10);
  };

  // Output object map
  const out = {};

  for (const r of records) {
    const dateStr =
      normalizeDateToYYYYMMDD(r.date) ||
      normalizeDateToYYYYMMDD(r.meal_date) ||
      normalizeDateToYYYYMMDD(r.ymd) ||
      normalizeDateToYYYYMMDD(r.day);

    if (!dateStr) continue;

    const menu =
      r.menu ||
      r.menus ||
      r.dishes ||
      r.food ||
      (r.menuName ? r.menuName : null) ||
      "";

    out[dateStr] = { menu: normalizeMenuToString(menu) };
  }

  return out;
}

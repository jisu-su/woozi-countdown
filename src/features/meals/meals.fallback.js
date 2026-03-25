/**
 * Meals fallback entrypoint.
 *
 * This project currently uses `meals.data.js` for fallback data.
 * This file exists so you have a "meals.fallback.*" place to import from
 * when you implement the API failure branch.
 *
 * Why it is a JS module:
 * - JSON cannot contain comments.
 * - We want every file in `src/` to be self-explanatory.
 *
 * Data format (same as `meals.data.js`):
 * {
 *   "YYYY-MM-DD": { menu: "메뉴1, 메뉴2, ..." }
 * }
 */
export { FALLBACK_MEALS } from "./meals.data.js";


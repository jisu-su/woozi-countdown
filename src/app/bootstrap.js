import { startCountdown } from "../features/countdown/countdown.controller.js";
import { initComments } from "../features/comments/comments.controller.js";
import { drawMeals, setMealsData } from "../features/meals/meals.controller.js";
import { FALLBACK_MEALS } from "../features/meals/meals.data.js";
import { drawMusic } from "../features/music/music.controller.js";

/**
 * Application bootstrap (entry-level initializer).
 *
 * This file is intentionally small: it wires feature modules together without
 * implementing feature-specific logic.
 *
 * Responsibilities:
 * 1) Provide initial data to the meals feature (fallback for resilience).
 * 2) Start long-running processes (countdown interval).
 * 3) Initialize interactive features (comments, music, meals UI render).
 *
 * How it works at runtime:
 * - `src/main.js` calls `bootstrap()` on `DOMContentLoaded`.
 * - `bootstrap()` then calls:
 *    - `setMealsData(fallback)` + `drawMeals()` for the initial meal grid
 *    - `startCountdown()` for the clock
 *    - `initComments()` to bind comment UI events and render existing comments
 *    - `drawMusic()` to render the songs section
 */
export function bootstrap({ fallbackMeals = FALLBACK_MEALS } = {}) {
  // Meals feature uses an internal "date-keyed map" structure:
  // { "YYYY-MM-DD": { menu: "..." } }
  setMealsData(fallbackMeals);

  // Countdown is time-based and updates the UI every second.
  startCountdown();

  // Comments module binds click handlers and renders stored comments.
  initComments();

  // Music module renders static song cards (data-driven).
  drawMusic();

  // Finally render the meals calendar for the currently selected week base date.
  drawMeals();
}

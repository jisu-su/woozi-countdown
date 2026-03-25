import { getCurrentBaseDate, setCurrentBaseDate } from "./meals.state.js";
import { renderWeeklyCalendar } from "./meals.view.js";
let mealDataByDate = {};
let lockYear = null;
let lockMonth = null;

/**
 * Meals controller.
 *
 * Responsibilities:
 * - Hold the current "meals data map" in memory (date-keyed object)
 * - Handle week navigation (changeWeek)
 * - Enforce a month range lock so the UI only moves within the loaded dataset
 * - Delegate DOM rendering to `meals.view.js`
 *
 * Data contract (IMPORTANT):
 * - `mealDataByDate` is an object map:
 *   {
 *     "YYYY-MM-DD": { menu: "메뉴1, 메뉴2, ..." }
 *   }
 */
export function setMealsData(nextMealsData) {
  // Replace current in-memory meals data.
  mealDataByDate = nextMealsData;

  // Lock year/month based on the first available key.
  // This prevents the user from navigating to months without data.
  const dates = Object.keys(mealDataByDate).sort();
  if (!dates.length) return;

  const firstDate = new Date(`${dates[0]}T00:00:00`);
  lockYear = firstDate.getFullYear();
  lockMonth = firstDate.getMonth();
  setCurrentBaseDate(firstDate);
}

export function changeWeek(direction) {
  // direction: -1 for previous week, +1 for next week
  const nextDate = new Date(getCurrentBaseDate());
  nextDate.setDate(nextDate.getDate() + direction * 7);

  // If navigation would leave the locked month, block it.
  if (
    lockYear !== null &&
    lockMonth !== null &&
    (nextDate.getFullYear() !== lockYear || nextDate.getMonth() !== lockMonth)
  ) {
    alert("식단표 범위 내에서만 이동 가능합니다!");
    return;
  }

  // Update state + redraw.
  setCurrentBaseDate(nextDate);
  drawMeals();
}

export function drawMeals() {
  // Render the 7-day calendar using current base date + current data map.
  renderWeeklyCalendar({
    baseDate: getCurrentBaseDate(),
    mealDataByDate,
  });
}

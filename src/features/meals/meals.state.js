/**
 * Meals feature state.
 *
 * The only mutable state we keep here is the current "week base date".
 * - The week base date is used to calculate the Sunday start date.
 * - `meals.controller.js` is responsible for updating it.
 *
 * Why this exists:
 * - Avoid reading/writing DOM for state.
 * - Make week navigation logic easier to reuse and test.
 */
const mealsState = {
  currentBaseDate: new Date(),
};

/**
 * @returns {Date} currentBaseDate (used as the reference for week navigation)
 */
export function getCurrentBaseDate() {
  return mealsState.currentBaseDate;
}

/**
 * @param {Date} nextDate
 */
export function setCurrentBaseDate(nextDate) {
  mealsState.currentBaseDate = nextDate;
}

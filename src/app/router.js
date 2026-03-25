import { setCurrentPageId } from "./state.js";

/**
 * Simple UI router for switching between "pages" (sections) in `index.html`.
 *
 * Notes:
 * - Page visibility is controlled by `.page` classes + inline `style.display`
 *   toggles (as in the original project).
 * - `#timer-page` behaves slightly differently (flex layout + sidebar hidden).
 *
 * Exports:
 * - `showPage(pageId)`: hides all `.page` elements then shows the target one.
 * - `goToMeal()`: convenience wrapper for `showPage("meal-page")`.
 */
export function showPage(pageId) {
  const allPages = document.querySelectorAll(".page");
  allPages.forEach((page) => {
    page.classList.remove("active");
    page.style.display = "none";
  });

  // If the element does not exist, just do nothing.
  const target = document.getElementById(pageId);
  if (!target) return;

  // Mark as active and show.
  target.classList.add("active");
  setCurrentPageId(pageId);

  // Sidebar visibility depends on which page is active.
  const sidebar = document.getElementById("main-sidebar");
  if (!sidebar) return;

  if (pageId === "timer-page") {
    sidebar.style.display = "none";
    // Countdown page uses `flex` to center the clock.
    target.style.display = "flex";
    return;
  }

  sidebar.style.display = "flex";
  // Other pages use `block` (default in this stylesheet).
  target.style.display = "block";
}

export function goToMeal() {
  showPage("meal-page");
}

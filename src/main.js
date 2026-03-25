import { bootstrap } from "./app/bootstrap.js";
import { goToMeal, showPage } from "./app/router.js";
import { changeWeek } from "./features/meals/meals.controller.js";

/**
 * Project entrypoint (ES module).
 *
 * This file binds DOM events after the page is ready, then calls `bootstrap()`
 * to initialize feature modules (countdown, meals, comments, music).
 *
 * Important:
 * - We intentionally avoid inline `onclick` attributes in `index.html`.
 * - Instead, we rely on `data-*` attributes + `addEventListener`.
 */
function bindUiEvents() {
  // Sidebar page switching:
  // `index.html` uses: <div class="nav-icon" data-page-id="...">
  document.querySelectorAll("#main-sidebar .nav-icon[data-page-id]").forEach((el) => {
    el.addEventListener("click", () => {
      showPage(el.getAttribute("data-page-id"));
    });
  });

  // Main timer area click -> meal page.
  const timerSection = document.getElementById("timer-page");
  if (timerSection) timerSection.addEventListener("click", goToMeal);

  // Meal week navigation:
  // `index.html` buttons have: data-week-direction="-1" | "1"
  document
    .querySelectorAll("#meal-page .arrow-btn[data-week-direction]")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const dir = Number(btn.getAttribute("data-week-direction"));
        if (!Number.isNaN(dir)) changeWeek(dir);
      });
    });
}

// Standard initialization:
// - Wait for DOM
// - Run feature bootstrap
// - Bind interaction events
document.addEventListener("DOMContentLoaded", () => {
  bootstrap();
  bindUiEvents();
});

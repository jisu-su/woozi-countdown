import { bootstrap } from "./app/bootstrap.js";
import { goToMeal, showPage } from "./app/router.js";
import { changeWeek } from "./features/meals/meals.controller.js";

function bindUiEvents() {
  // 사이드바 페이지 전환
  document.querySelectorAll("#main-sidebar .nav-icon[data-page-id]").forEach((el) => {
    el.addEventListener("click", () => {
      showPage(el.getAttribute("data-page-id"));
    });
  });

  // 메인 클릭 -> 식단 페이지로 이동
  const timerSection = document.getElementById("timer-page");
  if (timerSection) timerSection.addEventListener("click", goToMeal);

  // 주 이동 버튼
  document
    .querySelectorAll("#meal-page .arrow-btn[data-week-direction]")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const dir = Number(btn.getAttribute("data-week-direction"));
        if (!Number.isNaN(dir)) changeWeek(dir);
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  bootstrap();
  bindUiEvents();
});

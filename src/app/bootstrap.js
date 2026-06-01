import { startCountdown } from "../features/countdown/countdown.controller.js";
import { initComments } from "../features/comments/comments.controller.js";
import { drawMeals, setMealsData, setMealsStatus } from "../features/meals/meals.controller.js";
import { FALLBACK_MEALS } from "../features/meals/meals.data.js";
import { fetchMealsByMonth } from "../features/meals/meals.service.js";
import { drawMusic } from "../features/music/music.controller.js";

function getTargetMealMonth() {
  const mealYm = new URLSearchParams(window.location.search).get("mealYm");
  if (/^\d{6}$/.test(mealYm || "")) {
    return {
      year: Number(mealYm.slice(0, 4)),
      month: Number(mealYm.slice(4, 6)),
    };
  }

  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
}

export function bootstrap({ fallbackMeals = FALLBACK_MEALS } = {}) {
  setMealsData(fallbackMeals);

  startCountdown();
  initComments();
  drawMusic();
  drawMeals();

  fetchMealsByMonth(getTargetMealMonth())
    .then((mealsByDate) => {
      setMealsData(mealsByDate);
      setMealsStatus("");
      drawMeals();
    })
    .catch((error) => {
      console.warn("Using fallback meals data", error);
      setMealsStatus("API 연결에 실패해 임시 식단 데이터를 표시 중입니다.");
    });
}

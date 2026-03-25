import { startCountdown } from "../features/countdown/countdown.controller.js";
import { loadComments } from "../features/comments/comments.controller.js";
import { drawMeals, setMealsData } from "../features/meals/meals.controller.js";

export function bootstrap({ fallbackMeals = {} } = {}) {
  setMealsData(fallbackMeals);

  startCountdown();
  loadComments();
  drawMeals();
}

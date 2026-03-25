import { startCountdown } from "../features/countdown/countdown.controller.js";
import { loadComments } from "../features/comments/comments.controller.js";
import { drawMeals, setMealsData } from "../features/meals/meals.controller.js";
import { FALLBACK_MEALS } from "../features/meals/meals.data.js";
import { drawMusic } from "../features/music/music.controller.js";

export function bootstrap({ fallbackMeals = FALLBACK_MEALS } = {}) {
  setMealsData(fallbackMeals);

  startCountdown();
  loadComments();
  drawMusic();
  drawMeals();
}

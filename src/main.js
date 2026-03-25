import { bootstrap } from "./app/bootstrap.js";
import { goToMeal, showPage } from "./app/router.js";
import { addComment, deleteComment } from "./features/comments/comments.controller.js";
import { changeWeek } from "./features/meals/meals.controller.js";

// 기존 inline onclick 속성과 호환되도록 전역 노출
window.showPage = showPage;
window.goToMeal = goToMeal;
window.addComment = addComment;
window.deleteComment = deleteComment;
window.changeWeek = changeWeek;

document.addEventListener("DOMContentLoaded", () => {
  bootstrap();
});

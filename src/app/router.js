import { setCurrentPageId } from "./state.js";

export function showPage(pageId) {
  const allPages = document.querySelectorAll(".page");
  allPages.forEach((page) => {
    page.classList.remove("active");
    page.style.display = "none";
  });

  const target = document.getElementById(pageId);
  if (!target) return;

  target.classList.add("active");
  setCurrentPageId(pageId);

  const sidebar = document.getElementById("main-sidebar");
  if (!sidebar) return;

  if (pageId === "timer-page") {
    sidebar.style.display = "none";
    target.style.display = "flex";
    return;
  }

  sidebar.style.display = "flex";
  target.style.display = "block";
}

export function goToMeal() {
  showPage("meal-page");
}

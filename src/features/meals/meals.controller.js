import { getCurrentBaseDate, setCurrentBaseDate } from "./meals.state.js";
import { renderWeeklyCalendar } from "./meals.view.js";
let mealDataByDate = {};
let lockYear = null;
let lockMonth = null;

export function setMealsData(nextMealsData) {
  mealDataByDate = nextMealsData;
  const dates = Object.keys(mealDataByDate).sort();
  if (!dates.length) return;

  const firstDate = new Date(`${dates[0]}T00:00:00`);
  lockYear = firstDate.getFullYear();
  lockMonth = firstDate.getMonth();
  setCurrentBaseDate(firstDate);
}

export function changeWeek(direction) {
  const nextDate = new Date(getCurrentBaseDate());
  nextDate.setDate(nextDate.getDate() + direction * 7);
  if (
    lockYear !== null &&
    lockMonth !== null &&
    (nextDate.getFullYear() !== lockYear || nextDate.getMonth() !== lockMonth)
  ) {
    alert("식단표 범위 내에서만 이동 가능합니다!");
    return;
  }
  setCurrentBaseDate(nextDate);
  drawMeals();
}

export function drawMeals() {
  renderWeeklyCalendar({
    baseDate: getCurrentBaseDate(),
    mealDataByDate,
  });
}

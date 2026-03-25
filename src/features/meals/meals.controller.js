import { getCurrentBaseDate, setCurrentBaseDate } from "./meals.state.js";
import { renderWeeklyCalendar } from "./meals.view.js";
let mealDataByDate = {};

export function setMealsData(nextMealsData) {
  mealDataByDate = nextMealsData;
}

export function changeWeek(direction) {
  const nextDate = new Date(getCurrentBaseDate());
  nextDate.setDate(nextDate.getDate() + direction * 7);
  setCurrentBaseDate(nextDate);
  drawMeals();
}

export function drawMeals() {
  renderWeeklyCalendar({
    baseDate: getCurrentBaseDate(),
    mealDataByDate,
  });
}

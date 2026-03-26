import { getCurrentBaseDate, setCurrentBaseDate } from "./meals.state.js";
import { renderWeeklyCalendar } from "./meals.view.js";

// 현재 메모리에 로드된 식단 데이터(날짜별 객체 맵)
let mealDataByDate = {};
// 데이터가 존재하는 연도와 월을 고정하여, 사용자가 데이터 없는 곳으로 이동하지 못하게 합니다.
let lockYear = null;
let lockMonth = null;

/**
 * 식단 컨트롤러 (Meals Controller).
 *
 * 주요 역할:
 * - 현재 메모리에 로드된 식단 데이터(`mealDataByDate`)를 보관합니다.
 * - 주간 이동(이전 주, 다음 주) 기능을 처리합니다.
 * - 로드된 데이터 범위를 벗어나지 않도록 이동을 제한(Lock)합니다.
 * - 실제 화면에 그리는 작업은 `meals.view.js`에 위임합니다.
 *
 * 데이터 형식 (중요):
 * - `mealDataByDate`는 다음과 같은 형태입니다:
 *   {
 *     "YYYY-MM-DD": { menu: "메뉴1, 메뉴2, ..." }
 *   }
 */
export function setMealsData(nextMealsData) {
  // 메모리에 데이터를 업데이트합니다.
  mealDataByDate = nextMealsData;

  // 로드된 데이터 중 가장 첫 번째 날짜를 기준으로 연도와 월을 고정합니다.
  // 이렇게 하면 사용자가 데이터가 없는 다른 달로 넘어가는 것을 막을 수 있습니다.
  const dates = Object.keys(mealDataByDate).sort();
  if (!dates.length) return;

  const firstDate = new Date(`${dates[0]}T00:00:00`);
  lockYear = firstDate.getFullYear();
  lockMonth = firstDate.getMonth();
  // 현재 기준 날짜를 설정합니다.
  setCurrentBaseDate(firstDate);
}

/**
 * 주(Week)를 변경하는 함수입니다.
 * @param {number} direction - 이전 주는 -1, 다음 주는 +1
 */
export function changeWeek(direction) {
  const nextDate = new Date(getCurrentBaseDate());
  // 현재 날짜에서 7일씩 앞뒤로 이동합니다.
  nextDate.setDate(nextDate.getDate() + direction * 7);

  // 만약 고정된 연도나 월을 벗어나려고 하면 경고를 띄우고 이동을 취소합니다.
  if (
    lockYear !== null &&
    lockMonth !== null &&
    (nextDate.getFullYear() !== lockYear || nextDate.getMonth() !== lockMonth)
  ) {
    alert("식단표 범위 내에서만 이동 가능합니다!");
    return;
  }

  // 상태를 업데이트하고 화면을 다시 그립니다.
  setCurrentBaseDate(nextDate);
  drawMeals();
}

/**
 * 현재 상태와 데이터를 기반으로 화면에 식단을 그립니다.
 */
export function drawMeals() {
  // 현재 기준 날짜와 데이터를 사용하여 7일간의 달력을 렌더링합니다.
  renderWeeklyCalendar({
    baseDate: getCurrentBaseDate(),
    mealDataByDate,
  });
}

/**
 * 식단 기능 상태 관리 (Meals State).
 *
 * 여기에서 관리하는 유일한 상태는 '현재 주간의 기준 날짜'입니다.
 * - 이 기준 날짜를 통해 해당 주의 '일요일'이 언제인지 계산할 수 있습니다.
 * - 실제 날짜를 변경하는 로직은 `meals.controller.js`에서 수행합니다.
 *
 * 이 상태 관리가 왜 필요한가요?
 * - DOM(화면 요소)에 직접 데이터를 읽거나 쓰는 것보다 코드 관리가 쉬워집니다.
 * - 주간 이동 로직을 재사용하거나 테스트하기가 훨씬 편리합니다.
 */
const mealsState = {
  // 처음 앱이 실행되면 오늘 날짜를 기준으로 합니다.
  currentBaseDate: new Date(),
};

/**
 * 현재 설정된 기준 날짜를 가져옵니다. (주간 이동 로직의 참고 데이터)
 * @returns {Date} currentBaseDate
 */
export function getCurrentBaseDate() {
  return mealsState.currentBaseDate;
}

/**
 * 기준 날짜를 새로 업데이트합니다.
 * @param {Date} nextDate - 새롭게 설정할 날짜 객체
 */
export function setCurrentBaseDate(nextDate) {
  mealsState.currentBaseDate = nextDate;
}

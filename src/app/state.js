/**
 * 전역 UI 상태 관리 (Global UI State).
 *
 * 현재 앱에서 전역적으로 공유해야 하는 데이터를 한곳에 모아 관리합니다.
 * 지금은 '현재 활성화된 페이지 ID'만 저장하고 있습니다.
 *
 * 만약 나중에 다른 데이터들(예: 현재 선택된 주, 불러온 식단 데이터 등)이
 * 필요해지면 이곳에 추가하여 관리할 수 있습니다.
 * 데이터를 한곳에서 관리하면 코드의 흐름을 파악하기가 훨씬 쉬워집니다.
 */
const appState = {
  // 앱이 처음 켜질 때 기본적으로 보여줄 페이지 ID입니다.
  currentPageId: "timer-page",
};

/**
 * 현재 어떤 페이지가 활성화되어 있는지 확인하는 함수입니다.
 * @returns {string} 현재 활성화된 페이지 ID (예: "timer-page", "meal-page").
 */
export function getCurrentPageId() {
  return appState.currentPageId;
}

/**
 * 현재 보고 있는 페이지 정보를 업데이트(변경)하는 함수입니다.
 * @param {string} pageId - 새로 활성화할 페이지의 ID 문자열.
 */
export function setCurrentPageId(pageId) {
  // appState 객체 안에 있는 currentPageId 값을 새로운 값으로 바꿉니다.
  appState.currentPageId = pageId;
}

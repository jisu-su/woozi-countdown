import { bootstrap } from "./app/bootstrap.js";
import { goToMeal, showPage } from "./app/router.js";
import { changeWeek } from "./features/meals/meals.controller.js";

/**
 * 프로젝트의 진입점 (ES 모듈).
 *
 * 이 파일은 페이지가 준비되면 DOM 이벤트를 연결(바인딩)하고, `bootstrap()`을 호출하여
 * 각 기능 모듈(카운트다운, 식단, 댓글, 음악)을 초기화하는 역할을 합니다.
 *
 * 중요:
 * - `index.html`에서 직접 `onclick="..."`과 같은 속성을 사용하는 것을 지양합니다.
 * - 대신, HTML에는 `data-*` 속성으로 정보를 남기고 JavaScript에서 `addEventListener`로 이벤트를 처리합니다.
 * - 이렇게 하면 HTML은 구조에만 집중하고, 로직은 JavaScript에서 관리할 수 있어 코드가 더 깔끔해집니다.
 */
function bindUiEvents() {
  // 사이드바 페이지 전환 이벤트 처리:
  // `index.html`의 사이드바에서 `data-page-id` 속성을 가진 모든 메뉴 아이콘을 찾습니다.
  document.querySelectorAll("#main-sidebar .nav-icon[data-page-id]").forEach((el) => {
    el.addEventListener("click", () => {
      // 아이콘을 클릭하면 해당 `data-page-id`에 적힌 페이지 아이디를 `showPage` 함수에 전달합니다.
      showPage(el.getAttribute("data-page-id"));
    });
  });

  // 메인 타이머 영역을 클릭하면 식단 페이지로 이동하도록 설정합니다.
  const timerSection = document.getElementById("timer-page");
  if (timerSection) timerSection.addEventListener("click", goToMeal);

  // 식단 페이지에서 '이전 주', '다음 주' 버튼 클릭 이벤트 처리:
  // 버튼에 설정된 `data-week-direction` 값이 -1이면 이전 주, 1이면 다음 주를 의미합니다.
  document
    .querySelectorAll("#meal-page .arrow-btn[data-week-direction]")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        // 속성값(문자열)을 숫자로 변환합니다.
        const dir = Number(btn.getAttribute("data-week-direction"));
        // 올바른 숫자인 경우, 해당 방향으로 주간 데이터를 변경하는 함수를 호출합니다.
        if (!Number.isNaN(dir)) changeWeek(dir);
      });
    });
}

// 브라우저가 HTML을 모두 읽고 DOM 트리를 완성했을 때 실행됩니다.
document.addEventListener("DOMContentLoaded", () => {
  // 앱의 전체적인 초기 설정을 수행합니다.
  bootstrap();
  // 사용자가 클릭할 수 있는 버튼 등에 이벤트를 연결합니다.
  bindUiEvents();
});

import { setCurrentPageId } from "./state.js";

/**
 * 사용자 인터페이스(UI) 라우터.
 * `index.html`에 있는 여러 개의 "페이지" (섹션) 중에서 현재 보여줄 페이지를 제어합니다.
 *
 * 이 파일은 웹 사이트에서 마치 여러 장의 종이를 겹쳐놓고, 맨 앞의 종이를
 * 갈아 끼우는 것과 같은 원리로 동작합니다.
 *
 * 기술적인 특징:
 * - `.page` 클래스를 가진 모든 요소를 숨기고, 선택된 ID를 가진 요소만 보여줍니다.
 * - CSS 클래스 `.active`와 `style.display`를 사용하여 화면에 보일지 말지를 결정합니다.
 * - 특별하게 `#timer-page`는 전체 화면 구성상 사이드바를 숨기는 처리가 들어갑니다.
 *
 * 제공하는 기능:
 * - `showPage(pageId)`: 지정한 ID의 페이지를 보여주고 나머지는 숨깁니다.
 * - `goToMeal()`: 식단 페이지로 이동하고 싶을 때 간편하게 사용하는 도우미 함수입니다.
 */
export function showPage(pageId) {
  // 우선 화면에 있는 모든 '페이지'들을 찾아서 보이지 않게 처리합니다.
  const allPages = document.querySelectorAll(".page");
  allPages.forEach((page) => {
    // .active 클래스를 제거하고 display를 'none'으로 설정합니다.
    page.classList.remove("active");
    page.style.display = "none";
  });

  // 해당 ID를 가진 요소가 실제로 존재하는지 확인합니다.
  const target = document.getElementById(pageId);
  if (!target) return; // 만약 없으면 그냥 작업을 종료합니다.

  // 찾은 페이지를 활성화하고 화면에 표시합니다.
  target.classList.add("active");
  // 전역 상태에 현재 어떤 페이지를 보고 있는지 저장합니다.
  setCurrentPageId(pageId);

  // 사이드바 요소가 있는지 확인합니다.
  const sidebar = document.getElementById("main-sidebar");
  if (!sidebar) return;

  // 특별 처리: 만약 타이머 페이지라면 사이드바를 숨깁니다.
  if (pageId === "timer-page") {
    sidebar.style.display = "none";
    // 타이머 페이지는 화면 정가운데에 배치하기 위해 'flex'를 사용합니다.
    target.style.display = "flex";
    return;
  }

  // 그 외의 일반적인 페이지라면 사이드바를 다시 보여줍니다.
  sidebar.style.display = "flex";
  // 일반적인 블록 레이아웃 형태로 페이지를 표시합니다.
  target.style.display = "block";
}

/**
 * 식단 페이지로 바로 이동하도록 도와주는 함수입니다.
 */
export function goToMeal() {
  showPage("meal-page");
}

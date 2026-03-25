import { startCountdown } from "../features/countdown/countdown.controller.js";
import { initComments } from "../features/comments/comments.controller.js";
import { drawMeals, setMealsData } from "../features/meals/meals.controller.js";
import { FALLBACK_MEALS } from "../features/meals/meals.data.js";
import { drawMusic } from "../features/music/music.controller.js";

/**
 * 애플리케이션 부트스트랩 (앱의 초기 구성 파일).
 *
 * 이 파일은 앱이 시작될 때 필요한 여러 가지 기능들을 서로 연결해주는 역할을 합니다.
 * 각 기능이 어떻게 작동하는지보다는, 무엇을 먼저 시작할지에 집중합니다.
 *
 * 주요 역할:
 * 1) 식단 데이터가 없거나 로딩에 실패했을 때를 대비한 기본 데이터를 설정합니다.
 * 2) 카운트다운 타이머처럼 계속해서 돌아가는 로직을 시작합니다.
 * 3) 댓글, 음악, 식단 화면 등 사용자에게 보여지는 부분들을 초기화합니다.
 *
 * 앱이 실행될 때의 과정:
 * - `src/main.js`에서 페이지 로딩이 끝나면 `bootstrap()`을 호출합니다.
 * - `bootstrap()`은 내부적으로 다음 작업들을 수행합니다:
 *    - `setMealsData` + `drawMeals`: 식단 표의 초기 모습을 그려줍니다.
 *    - `startCountdown`: 타이머(시계)를 작동시킵니다.
 *    - `initComments`: 댓글 기능을 준비하고 이전에 작성된 댓글들을 불러와 보여줍니다.
 *    - `drawMusic`: 노래 목록을 화면에 표시합니다.
 */
export function bootstrap({ fallbackMeals = FALLBACK_MEALS } = {}) {
  // 식단 기능은 날짜를 키(Key)로 하는 객체 구조를 사용합니다.
  // 예: { "2023-12-25": { menu: "크리스마스 특별식" } }
  setMealsData(fallbackMeals);

  // 카운트다운 기능은 매초마다 UI를 업데이트하며 시간을 표시합니다.
  startCountdown();

  // 댓글 모듈은 클릭 이벤트(전송 버튼 등)를 연결하고 저장된 댓글을 렌더링합니다.
  initComments();

  // 음악 모듈은 설정된 노래 목록을 바탕으로 카드 형태의 UI를 만듭니다.
  drawMusic();

  // 마지막으로, 현재 선택된 주(Week)의 기준 날짜에 맞춰 식단 달력을 화면에 그립니다.
  drawMeals();
}

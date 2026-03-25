/**
 * 식단 대체 데이터 (Fallback Entrypoint).
 *
 * 이 프로젝트는 현재 `meals.data.js`를 대체용(fallback) 데이터로 사용하고 있습니다.
 * 이 파일은 나중에 API 통신 중 에러가 발생했을 때 백업 데이터를 불러올 수 있도록
 * 미리 만들어둔 구조입니다.
 *
 * 왜 JSON이 아닌 JavaScript 파일(.js)을 쓰나요?
 * - JSON 파일 안에는 주석을 달 수 없기 때문입니다.
 * - `src/` 안에 있는 모든 파일에 개발자를 위한 설명을 적어두기 위함입니다.
 *
 * 데이터 형식 (`meals.data.js`와 동일):
 * {
 *   "YYYY-MM-DD": { menu: "메뉴1, 메뉴2, ..." }
 * }
 */
export { FALLBACK_MEALS } from "./meals.data.js";

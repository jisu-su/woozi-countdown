import { toMealsByDate } from "./meals.adapter.js";

/**
 * 식단 서비스 (네트워크 통신 계층).
 *
 * 이 파일은 실제 공공데이터 API 등에서 식단 정보를 가져오는 기능을 수행합니다.
 *
 * 현재 동작:
 * - 예시 URL을 호출합니다.
 * - JSON 응답을 `meals.adapter.js`를 통해 내부 포맷으로 변환합니다.
 *
 * 실제 API를 연결할 때 해야 할 일:
 * 1) `https://example.com/meals`를 실제 API 주소로 교체하세요.
 * 2) API 키가 필요하다면 헤더(Header)나 쿼리 파라미터(Query Param)에 추가하세요.
 * 3) 식단 캐싱(매번 불러오지 않도록 로컬 저장소 등에 저장) 기능을 고려해보세요.
 * 4) 반환되는 데이터 형태가 `{ "YYYY-MM-DD": { menu: "..." } }` 인지 확인하세요.
 */
export async function fetchMealsByMonth({ year, month }) {
  // TODO: 실제 공공데이터 API URL과 KEY가 생기면 이곳을 교체하세요.
  // month 파라미터는 보통 1~12 기준으로 전달하는 것이 권장됩니다.
  const url = new URL("https://example.com/meals");
  url.searchParams.set("year", String(year));
  url.searchParams.set("month", String(month));

  // 데이터를 요청하고 결과를 JSON으로 분석합니다.
  const response = await fetch(url);
  if (!response.ok) {
    // 요청에 실패하면 에러를 발생시켜, 호출한 곳에서 대체 데이터(Fallback)를 쓸 수 있게 합니다.
    throw new Error("Failed to fetch meals");
  }

  const raw = await response.json();
  // API 응답 데이터를 우리가 쓰기 편한 내부 형식으로 변환합니다.
  return toMealsByDate(raw);
}

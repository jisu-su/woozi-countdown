/**
 * 식단 데이터 어댑터 (Meals Adapter).
 *
 * 역할:
 * - 외부 API에서 받아온 다양한 형태의 데이터를 우리 프로젝트의 내부 형식에 맞게 변환합니다.
 * - 덕분에 `meals.view.js`는 데이터가 어디서 왔는지 상관없이 항상 동일한 방식으로 화면을 그릴 수 있습니다.
 *
 * `meals.view.js`가 기대하는 내부 형식:
 * {
 *   "YYYY-MM-DD": { menu: "메뉴1, 메뉴2, ..." }
 * }
 *
 * 참고 사항 (실제 API를 연결할 때):
 * - 이 파일 안의 변환 로직(mapping rules)만 수정하면 됩니다.
 * - 반환되는 객체의 형태(날짜를 키로 하는 객체 맵)는 반드시 유지해야 합니다.
 */
export function toMealsByDate(apiResponse) {
  // 방어 코드: 데이터가 없는 경우 빈 객체를 반환합니다.
  if (!apiResponse) return {};

  // 1) 만약 데이터가 이미 우리가 원하는 내부 형식(날짜 키 + menu 속성)이라면 그대로 반환합니다.
  if (typeof apiResponse === "object" && !Array.isArray(apiResponse)) {
    const keys = Object.keys(apiResponse);
    if (keys.length && keys.every((k) => /^\d{4}-\d{2}-\d{2}$/.test(k))) {
      const looksLikeInternal = apiResponse[keys[0]] && typeof apiResponse[keys[0]].menu !== "undefined";
      if (looksLikeInternal) return apiResponse;
    }
  }

  // 2) 그렇지 않다면, 응답 데이터 내부에서 실제 목록(배열)을 찾습니다.
  // 많은 API들이 'items', 'data', 'result' 등의 키 아래에 목록을 담아줍니다.
  const records =
    (Array.isArray(apiResponse) && apiResponse) ||
    apiResponse.items ||
    apiResponse.data ||
    apiResponse.result ||
    apiResponse.meals ||
    [];

  if (!Array.isArray(records)) return {};

  /**
   * 메뉴 값을 문자열로 표준화합니다.
   * 화면에서는 이 문자열을 쉼표(,)나 슬래시(/) 기준으로 나누어 줄바꿈 표시합니다.
   */
  const normalizeMenuToString = (menu) => {
    if (!menu) return "";
    if (typeof menu === "string") return menu;
    if (Array.isArray(menu)) return menu.map((x) => String(x)).join(", ");
    if (typeof menu === "object") {
      if (Array.isArray(menu.menu)) return menu.menu.map((x) => String(x)).join(", ");
      if (Array.isArray(menu.dishes)) return menu.dishes.map((x) => String(x)).join(", ");
    }
    return String(menu);
  };

  /**
   * 다양한 날짜 형식을 `YYYY-MM-DD` 형식으로 통일합니다.
   */
  const normalizeDateToYYYYMMDD = (dateVal) => {
    if (!dateVal) return null;
    const s = String(dateVal);
    // 2026-02-01 형식인 경우
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    // 20260201 형식인 경우
    if (/^\d{8}$/.test(s)) return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;

    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return null;
    // 로컬 타임존 이슈를 최소화하기 위해 ISO 형식의 앞부분 10자리만 추출합니다.
    return d.toISOString().slice(0, 10);
  };

  // 결과물을 담을 객체
  const out = {};

  for (const r of records) {
    // API마다 날짜 속성명이 다를 수 있으므로 여러 경우를 체크합니다.
    const dateStr =
      normalizeDateToYYYYMMDD(r.date) ||
      normalizeDateToYYYYMMDD(r.meal_date) ||
      normalizeDateToYYYYMMDD(r.ymd) ||
      normalizeDateToYYYYMMDD(r.day);

    if (!dateStr) continue;

    // 메뉴 정보도 다양한 속성명을 체크합니다.
    const menu =
      r.menu ||
      r.menus ||
      r.dishes ||
      r.food ||
      (r.menuName ? r.menuName : null) ||
      "";

    out[dateStr] = { menu: normalizeMenuToString(menu) };
  }

  return out;
}

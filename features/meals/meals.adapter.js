/**
 * API 응답 XML 문자열 → 내부 포맷 { "YYYY-MM-DD": { brst, lunc, dinr, sumCal } }
 */
export function toMealsByDate(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "text/xml");
  const rows = doc.querySelectorAll("row");

  const map = {}; // 날짜별로 쌓을 객체

  rows.forEach((row) => {
    // ① 날짜에서 요일 제거: "2024-12-08(일)" → "2024-12-08"
    const rawDate = row.querySelector("dates")?.textContent ?? "";
    const dateKey = rawDate.replace(/\(.*?\)/, "").trim();
    if (!dateKey) return;

    // ② 해당 날짜 슬롯이 없으면 초기화
    if (!map[dateKey]) {
      map[dateKey] = { brst: [], lunc: [], dinr: [], sumCal: "" };
    }

    // ③ 각 끼니 메뉴 수집 (빈 값 제외)
    const brst = row.querySelector("brst")?.textContent?.trim();
    const lunc = row.querySelector("lunc")?.textContent?.trim();
    const dinr = row.querySelector("dinr")?.textContent?.trim();
    const sumCal = row.querySelector("sum_cal")?.textContent?.trim();

    if (brst) map[dateKey].brst.push(brst);
    if (lunc) map[dateKey].lunc.push(lunc);
    if (dinr) map[dateKey].dinr.push(dinr);
    if (sumCal) map[dateKey].sumCal = sumCal; // 마지막 row 값으로 덮어씀 (동일)
  });

  // ④ 배열 → 문자열로 변환
  const result = {};
  Object.entries(map).forEach(([date, meals]) => {
    result[date] = {
      brst: meals.brst.join(" / "),
      lunc: meals.lunc.join(" / "),
      dinr: meals.dinr.join(" / "),
      sumCal: meals.sumCal,
    };
  });

  return result;
}
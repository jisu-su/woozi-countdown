/**
 * 카운트다운 화면 렌더링 (Countdown View).
 *
 * 이 파일은 오직 화면(DOM)을 업데이트하는 일만 합니다:
 * - `#clock` 요소의 텍스트 내용을 변경합니다.
 * - 시간을 계산하거나 타이머를 관리하지 않습니다.
 */
export function renderCountdown(text) {
  /**
   * @param {string} text - 이미 형식이 맞추어진 카운트다운 문자열 (예: "100d 00:00:00")
   */
  const clockEl = document.getElementById("clock");
  if (!clockEl) return;
  // 전달받은 텍스트를 시계 요소에 넣습니다.
  clockEl.innerHTML = text;
}

/**
 * 카운트다운 로직 및 포맷팅 도구 (Countdown Logic).
 *
 * 이 파일은 "순수 함수"들로 구성되어 있습니다:
 * - DOM 요소에 직접 접근하지 않습니다.
 * - 타이머(`setInterval` 등)를 직접 실행하지 않습니다.
 * - 오직 시간 값을 계산하고 문자열로 변환하는 일만 수행합니다. (테스트하기 매우 좋습니다)
 */

/**
 * 목표 시간과 현재 시간의 차이를 일, 시, 분, 초 단위로 나누어 반환합니다.
 * @param {number} targetTimestamp - 목표 시점의 밀리초(ms) 값
 * @param {number} nowTimestamp - 현재 시점의 밀리초(ms) 값 (기본값은 현재 시간)
 * @returns {{days:number, hours:number, minutes:number, seconds:number}}
 */
export function getCountdownParts(targetTimestamp, nowTimestamp = Date.now()) {
  const distance = targetTimestamp - nowTimestamp;

  // 전체 밀리초를 일, 시, 분, 초로 변환하는 수학적 계산입니다.
  // 1초 = 1000ms, 1분 = 60초, 1시간 = 60분, 1일 = 24시간
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

/**
 * 숫자 형태의 시간 데이터를 "Xd HH:MM:SS" 형식의 문자열로 바꿉니다.
 * @param {{days:number, hours:number, minutes:number, seconds:number}} parts
 * @returns {string} 예: "100d 05:09:01"
 */
export function formatCountdown({ days, hours, minutes, seconds }) {
  // padStart(2, "0")는 숫자가 한 자리일 때 앞에 '0'을 붙여서 항상 두 자리를 유지하게 합니다.
  return `${days}d ${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

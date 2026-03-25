import { COUNTDOWN_TARGET_DATE } from "./countdown.config.js";
import { formatCountdown, getCountdownParts } from "./countdown.logic.js";
import { renderCountdown } from "./countdown.view.js";

/**
 * 카운트다운 컨트롤러 (Countdown Controller).
 *
 * 주요 역할:
 * - 매초마다 돌아가는 타이머(1초 간격)를 시작하거나 멈춥니다.
 * - 목표 날짜를 받아서 남은 일/시/분/초로 계산하고, 형식에 맞게 문자열로 변환합니다.
 * - 실제 화면 업데이트는 `countdown.view.js`에 맡깁니다.
 *
 * 제공하는 함수:
 * - `updateCountdown()`: 한 번의 계산과 화면 업데이트를 수행합니다.
 * - `startCountdown()`: 주기적인 업데이트를 시작합니다.
 * - `stopCountdown()`: 실행 중인 타이머를 멈춥니다.
 */

// 설정 파일에 적힌 목표 날짜를 타임스탬프(ms)로 바꿉니다.
const targetTimestamp = new Date(COUNTDOWN_TARGET_DATE).getTime();
// setInterval의 ID를 보관하여 멈출 수 있게 합니다.
let timerId = null;

/**
 * 남은 시간을 계산하여 화면에 표시합니다.
 */
export function updateCountdown() {
  // 1) 타임스탬프 값을 {days, hours, minutes, seconds} 객체로 분해합니다.
  const parts = getCountdownParts(targetTimestamp);
  // 2) 이 객체를 예쁜 문자열로 바꿉니다.
  const formatted = formatCountdown(parts);
  // 3) 화면에 렌더링합니다.
  renderCountdown(formatted);
}

/**
 * 카운트다운 타이머를 1초마다 실행하도록 설정합니다.
 */
export function startCountdown() {
  // 타이머가 이미 돌아가고 있다면 중복 방지를 위해 먼저 멈춥니다.
  if (timerId) clearInterval(timerId);

  // 기다리지 않고 즉시 한 번 업데이트합니다.
  updateCountdown();

  // 1000ms(1초)마다 `updateCountdown` 함수를 실행합니다.
  timerId = setInterval(updateCountdown, 1000);
}

/**
 * 카운트다운 타이머를 중지합니다.
 */
export function stopCountdown() {
  // 실행 중인 타이머가 없으면 아무 일도 하지 않습니다.
  if (!timerId) return;

  // 타이머를 멈추고 변수를 초기화합니다.
  clearInterval(timerId);
  timerId = null;
}

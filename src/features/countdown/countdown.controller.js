import { COUNTDOWN_TARGET_DATE } from "./countdown.config.js";
import { formatCountdown, getCountdownParts } from "./countdown.logic.js";
import { renderCountdown } from "./countdown.view.js";

const targetTimestamp = new Date(COUNTDOWN_TARGET_DATE).getTime();
let timerId = null;

export function updateCountdown() {
  const parts = getCountdownParts(targetTimestamp);
  renderCountdown(formatCountdown(parts));
}

export function startCountdown() {
  if (timerId) clearInterval(timerId);
  updateCountdown();
  timerId = setInterval(updateCountdown, 1000);
}

export function stopCountdown() {
  if (!timerId) return;
  clearInterval(timerId);
  timerId = null;
}

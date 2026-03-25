/**
 * Countdown controller.
 *
 * Responsibilities:
 * - Start/stop the 1-second timer
 * - Convert targetDate -> parts -> formatted string
 * - Delegate actual DOM update to `countdown.view.js`
 *
 * Exports:
 * - `updateCountdown()`: compute + render once
 * - `startCountdown()`: start interval (idempotent)
 * - `stopCountdown()`: clear interval
 */
import { COUNTDOWN_TARGET_DATE } from "./countdown.config.js";
import { formatCountdown, getCountdownParts } from "./countdown.logic.js";
import { renderCountdown } from "./countdown.view.js";

const targetTimestamp = new Date(COUNTDOWN_TARGET_DATE).getTime();
let timerId = null;

export function updateCountdown() {
  // Convert epoch ms -> {days,hours,minutes,seconds}
  const parts = getCountdownParts(targetTimestamp);
  // Convert parts -> formatted string for UI
  renderCountdown(formatCountdown(parts));
}

export function startCountdown() {
  // If interval was already running, clear first to avoid duplicates.
  if (timerId) clearInterval(timerId);
  updateCountdown();
  // Store interval id so stopCountdown can clear it.
  timerId = setInterval(updateCountdown, 1000);
}

export function stopCountdown() {
  // Stop only if we previously started.
  if (!timerId) return;
  clearInterval(timerId);
  timerId = null;
}

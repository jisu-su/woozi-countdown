/**
 * Countdown DOM renderer.
 *
 * This file is "view only":
 * - It updates `#clock` text
 * - It does not compute time or manage intervals
 */
export function renderCountdown(text) {
  /**
   * @param {string} text - final countdown text (already formatted)
   */
  const clockEl = document.getElementById("clock");
  if (!clockEl) return;
  clockEl.innerHTML = text;
}

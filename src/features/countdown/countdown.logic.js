/**
 * Countdown calculation + formatting utilities.
 *
 * Keep this file "pure":
 * - No DOM access
 * - No timers
 * - Only convert timestamps <-> parts, then format to a string
 */
export function getCountdownParts(targetTimestamp, nowTimestamp = Date.now()) {
  /**
   * @param {number} targetTimestamp - target epoch ms
   * @param {number} nowTimestamp - current epoch ms (for testing)
   * @returns {{days:number, hours:number, minutes:number, seconds:number}}
   */
  const distance = targetTimestamp - nowTimestamp;

  // Whole day count.
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  // Remaining hours after extracting days.
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  // Remaining minutes after extracting hours.
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  // Remaining seconds after extracting minutes.
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

export function formatCountdown({ days, hours, minutes, seconds }) {
  /**
   * @param {{days:number, hours:number, minutes:number, seconds:number}} parts
   * @returns {string} format: "Xd HH:MM:SS"
   */
  return `${days}d ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

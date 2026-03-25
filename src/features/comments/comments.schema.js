/**
 * Comments schema / validation.
 *
 * Keep this file small and deterministic:
 * - Do not touch DOM
 * - Do not touch storage
 * - Only validate input data shape/value
 */
export function isValidCommentText(text) {
  // Basic rules:
  // - Must be a non-empty string
  // - Max length 500 chars to avoid very large payloads
  return typeof text === "string" && text.trim().length > 0 && text.trim().length <= 500;
}

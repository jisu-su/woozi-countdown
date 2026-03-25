export function isValidCommentText(text) {
  return typeof text === "string" && text.trim().length > 0 && text.trim().length <= 500;
}

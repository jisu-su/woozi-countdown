/**
 * Comments storage layer.
 *
 * Right now we store comments in `localStorage` as a simple guestbook:
 * - Key: `woozi_comments`
 * - Value: JSON array of:
 *   { text: string, date: string }
 *
 * Later (Issue #3):
 * - Replace this module with Cloudflare Workers + D1 / DB-backed storage.
 * - Keep the controller/view interfaces the same.
 */
const COMMENTS_KEY = "woozi_comments";

/**
 * Load stored comments.
 * @returns {{text:string, date:string}[]}
 */
export function getStoredComments() {
  return JSON.parse(localStorage.getItem(COMMENTS_KEY) || "[]");
}

/**
 * Persist comments array to localStorage.
 * @param {{text:string, date:string}[]} comments
 */
export function setStoredComments(comments) {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

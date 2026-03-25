import { isValidCommentText } from "./comments.schema.js";
import { getStoredComments, setStoredComments } from "./comments.storage.js";
import { loadComments } from "./comments.view.js";

/**
 * Comments controller.
 *
 * Responsibilities:
 * - Handle UI events (submit / delete)
 * - Validate data (schema)
 * - Read/write storage (localStorage for now)
 * - Delegate rendering to `comments.view.js`
 *
 * Important:
 * - This controller currently keeps the same in-memory model:
 *   [{ text, date }]
 *   where `date` is a human readable string.
 */
export function addComment() {
  const input = document.getElementById("comment-input");
  if (!input) return;

  // Read and validate comment text.
  const text = input.value.trim();
  if (!isValidCommentText(text)) return;

  // Load current comments and insert the new comment at the beginning (newest first).
  const comments = getStoredComments();
  comments.unshift({ text, date: new Date().toLocaleString() });
  setStoredComments(comments);

  input.value = "";

  // Re-render after state change.
  syncComments();
}

export function deleteComment(index) {
  if (!confirm("이 소중한 응원을 삭제할까요?")) return;

  // Delete by rendered index (matches current order).
  const comments = getStoredComments();
  comments.splice(index, 1);
  setStoredComments(comments);

  // Re-render after state change.
  syncComments();
}

function syncComments() {
  // Helper: load storage -> render view
  const listEl = document.getElementById("comment-list");
  if (!listEl) return;
  loadComments(listEl, getStoredComments(), deleteComment);
}

export function initComments() {
  // Bind submit button click once at startup.
  const submitBtn = document.getElementById("comment-submit");
  if (submitBtn) submitBtn.addEventListener("click", addComment);

  // Initial render from storage.
  syncComments();
}

import { isValidCommentText } from "./comments.schema.js";
import { getStoredComments, setStoredComments } from "./comments.storage.js";
import { loadComments } from "./comments.view.js";

export function addComment() {
  const input = document.getElementById("comment-input");
  if (!input) return;

  const text = input.value.trim();
  if (!isValidCommentText(text)) return;

  const comments = getStoredComments();
  comments.unshift({ text, date: new Date().toLocaleString() });
  setStoredComments(comments);

  input.value = "";
  syncComments();
}

export function deleteComment(index) {
  if (!confirm("이 소중한 응원을 삭제할까요?")) return;

  const comments = getStoredComments();
  comments.splice(index, 1);
  setStoredComments(comments);
  syncComments();
}

function syncComments() {
  const listEl = document.getElementById("comment-list");
  if (!listEl) return;
  loadComments(listEl, getStoredComments(), deleteComment);
}

export function initComments() {
  const submitBtn = document.getElementById("comment-submit");
  if (submitBtn) submitBtn.addEventListener("click", addComment);

  syncComments();
}

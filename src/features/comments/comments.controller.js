import { isValidCommentText } from "./comments.schema.js";
import { getStoredComments, setStoredComments } from "./comments.storage.js";
import { renderComments } from "./comments.view.js";

export function addComment() {
  const input = document.getElementById("comment-input");
  const listEl = document.getElementById("comment-list");
  if (!input || !listEl) return;

  const text = input.value.trim();
  if (!isValidCommentText(text)) return;

  const comments = getStoredComments();
  comments.unshift({ text, date: new Date().toLocaleString() });
  setStoredComments(comments);

  input.value = "";
  loadComments();
}

export function deleteComment(index) {
  if (!confirm("이 소중한 응원을 삭제할까요?")) return;

  const comments = getStoredComments();
  comments.splice(index, 1);
  setStoredComments(comments);
  loadComments();
}

export function loadComments() {
  const listEl = document.getElementById("comment-list");
  if (!listEl) return;
  renderComments(listEl, getStoredComments(), deleteComment);
}

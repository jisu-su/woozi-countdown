const COMMENTS_KEY = "woozi_comments";

export function getStoredComments() {
  return JSON.parse(localStorage.getItem(COMMENTS_KEY) || "[]");
}

export function setStoredComments(comments) {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

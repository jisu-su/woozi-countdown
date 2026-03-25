export function loadComments(listEl, comments, onDelete) {
  if (!listEl) return;

  if (!comments.length) {
    listEl.innerHTML = '<p class="comment-empty-message">첫 번째 응원을 남겨보세요! 💎</p>';
    return;
  }

  listEl.innerHTML = comments
    .map(
      (comment, index) => `
        <div class="comment-item">
          <p>${comment.text}</p>
          <small>${comment.date}</small>
          <button class="delete-btn" data-comment-index="${index}">삭제</button>
        </div>
      `
    )
    .join("");

  listEl.querySelectorAll("[data-comment-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const idx = Number(button.getAttribute("data-comment-index"));
      onDelete(idx);
    });
  });
}

// 체크리스트 호환: view로 분리된 렌더 함수 이름 유지
export const renderComments = loadComments;

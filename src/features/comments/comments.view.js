export function renderComments(listEl, comments, onDelete) {
  if (!listEl) return;

  if (!comments.length) {
    listEl.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">첫 번째 응원을 남겨보세요! 💎</p>';
    return;
  }

  listEl.innerHTML = comments
    .map(
      (comment, index) => `
        <div class="comment-item" style="background: white; padding: 15px; border-radius: 15px; margin-bottom: 12px; position: relative; border-left: 6px solid var(--rose-quartz); box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <p style="margin-bottom: 5px; color: #333;">${comment.text}</p>
          <small style="color: #999; font-size: 0.8rem;">${comment.date}</small>
          <button class="delete-btn" data-comment-index="${index}" style="position: absolute; top: 12px; right: 15px; background: #ffebeb; color: #ff6b6b; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">삭제</button>
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

/**
 * 댓글 화면 렌더링 (Comments View).
 *
 * 이 파일은 데이터를 받아 화면(UI)을 그리는 일만 수행합니다.
 * - 컨트롤러로부터 데이터와 콜백 함수를 전달받습니다.
 * - `.comment-list` DOM 요소를 업데이트합니다.
 *
 * 데이터 형태:
 * - comments: { text: string, date: string } 객체의 배열
 */
export function loadComments(listEl, comments, onDelete) {
  /**
   * 댓글 목록을 렌더링합니다.
   *
   * 매개변수:
   * - listEl: 댓글 목록이 담길 컨테이너 요소
   * - comments: 최신순으로 정렬된 { text, date } 객체의 배열
   * - onDelete: 삭제 버튼을 누를 때 인덱스를 넘겨줄 콜백 함수
   *
   * 구현 세부사항:
   * - 인라인 `onclick` 대신 데이터 속성(data-*)을 사용합니다.
   * - 렌더링 직후 각 버튼에 클릭 리스너를 붙입니다. (소규모 목록에서 안전한 방식)
   */
  if (!listEl) return;

  // 댓글이 하나도 없는 경우 보여줄 메시지입니다.
  if (!comments.length) {
    listEl.innerHTML =
      '<p class="comment-empty-message">첫 번째 응원을 남겨보세요! 💎</p>';
    return;
  }

  // 각 댓글 데이터를 HTML 코드로 변환하여 한꺼번에 화면에 넣습니다.
  listEl.innerHTML = comments
    .map(
      (comment, index) => `
        <div class="comment-item">
          <p>${comment.text}</p>
          <small>${comment.date}</small>
          <!-- 삭제 버튼에 인덱스 번호를 저장해 둡니다. -->
          <button class="delete-btn" data-comment-index="${index}">삭제</button>
        </div>
      `
    )
    .join("");

  // 방금 화면에 그려진 모든 삭제 버튼들에 클릭 이벤트를 연결합니다.
  listEl.querySelectorAll("[data-comment-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const idx = Number(button.getAttribute("data-comment-index"));
      // 버튼의 인덱스 값을 컨트롤러의 삭제 함수로 넘겨줍니다.
      onDelete(idx);
    });
  });
}

/**
 * 체크리스트 호환: 다른 곳에서 'renderComments'라는 이름으로 부를 수 있도록 별칭을 둡니다.
 */
export const renderComments = loadComments;

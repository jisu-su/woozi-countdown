import { isValidCommentText } from "./comments.schema.js";
import { getStoredComments, setStoredComments } from "./comments.storage.js";
import { loadComments } from "./comments.view.js";

/**
 * 댓글 컨트롤러 (Comments Controller).
 *
 * 주요 역할:
 * - UI 이벤트 처리 (댓글 등록 / 삭제 버튼 클릭 등)
 * - 데이터 유효성 검사 (입력값이 올바른지 확인)
 * - 저장소 읽기/쓰기 (현재는 브라우저의 localStorage 사용)
 * - 화면 그리기 작업을 `comments.view.js`에 위임
 *
 * 데이터 모델:
 * - [{ text, date }] 형태의 배열을 사용합니다.
 * - `date`는 사람이 읽기 좋은 형태의 날짜 문자열입니다.
 */

/**
 * 새로운 댓글을 추가하는 함수입니다.
 */
export function addComment() {
  const input = document.getElementById("comment-input");
  if (!input) return;

  // 입력된 텍스트를 가져오고 앞뒤 공백을 제거합니다.
  const text = input.value.trim();
  // 유효한 텍스트인지 검사합니다 (내용이 있는지, 너무 길지는 않은지 등).
  if (!isValidCommentText(text)) return;

  // 기존 댓글 목록을 가져와서 새 댓글을 맨 앞에 추가합니다 (최신순).
  const comments = getStoredComments();
  comments.unshift({ text, date: new Date().toLocaleString() });
  // 변경된 목록을 다시 저장소에 저장합니다.
  setStoredComments(comments);

  // 입력창을 비웁니다.
  input.value = "";

  // 데이터가 바뀌었으므로 화면을 동기화(다시 그리기)합니다.
  syncComments();
}

/**
 * 특정 인덱스의 댓글을 삭제하는 함수입니다.
 * @param {number} index - 삭제할 댓글의 배열 내 위치
 */
export function deleteComment(index) {
  // 사용자에게 한 번 더 물어봅니다.
  if (!confirm("이 소중한 응원을 삭제할까요?")) return;

  // 해당 인덱스의 댓글을 배열에서 제거합니다.
  const comments = getStoredComments();
  comments.splice(index, 1);
  // 변경된 목록을 저장소에 반영합니다.
  setStoredComments(comments);

  // 화면을 다시 그립니다.
  syncComments();
}

/**
 * 저장소의 데이터와 화면을 일치시키는 도우미 함수입니다.
 */
function syncComments() {
  const listEl = document.getElementById("comment-list");
  if (!listEl) return;
  // 저장된 데이터를 가져와서 뷰 렌더러에 전달합니다.
  loadComments(listEl, getStoredComments(), deleteComment);
}

/**
 * 댓글 기능을 초기화합니다.
 */
export function initComments() {
  // 등록 버튼에 클릭 이벤트를 연결합니다.
  const submitBtn = document.getElementById("comment-submit");
  if (submitBtn) submitBtn.addEventListener("click", addComment);

  // 앱이 시작될 때 저장된 댓글들을 처음으로 화면에 보여줍니다.
  syncComments();
}

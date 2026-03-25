/**
 * 댓글 저장소 계층 (Comments Storage Layer).
 *
 * 현재는 브라우저의 `localStorage`를 사용하여 간단한 방명록 정보를 저장합니다.
 * - Key: `woozi_comments`
 * - Value: JSON 형태의 댓글 배열 [{ text: string, date: string }]
 *
 * 나중에 실제 서버와 데이터베이스(DB)를 사용하게 되면 이 모듈을 교체하게 됩니다.
 * 이때 컨트롤러나 뷰와의 인터페이스(함수명, 반환값 형태)는 그대로 유지하는 것이 좋습니다.
 */
const COMMENTS_KEY = "woozi_comments";

/**
 * 저장된 댓글 목록을 가져옵니다.
 * @returns {{text:string, date:string}[]}
 */
export function getStoredComments() {
  // localStorage에서 데이터를 읽어와 JSON 객체로 변환합니다. 없으면 빈 배열([])을 반환합니다.
  return JSON.parse(localStorage.getItem(COMMENTS_KEY) || "[]");
}

/**
 * 댓글 배열을 localStorage에 영구적으로 저장합니다.
 * @param {{text:string, date:string}[]} comments - 저장할 댓글 데이터 배열
 */
export function setStoredComments(comments) {
  // 배열을 문자열(JSON string)로 변환하여 저장합니다.
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

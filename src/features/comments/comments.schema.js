/**
 * 댓글 스키마 및 유효성 검사 (Comments Schema).
 *
 * 이 파일은 입력 데이터가 올바른 형식인지 검증하는 역할만 담당합니다.
 * - DOM 요소를 직접 건드리지 않습니다.
 * - 저장소를 직접 건드리지 않습니다.
 * - 오로지 주어진 데이터 값만 판단합니다. (순수 함수)
 */
export function isValidCommentText(text) {
  // 기본 규칙:
  // - 문자열이어야 하며, 공백을 제외한 내용이 있어야 합니다.
  // - 최대 길이는 500자로 제한하여 너무 긴 데이터가 들어오는 것을 막습니다.
  return (
    typeof text === "string" &&
    text.trim().length > 0 &&
    text.trim().length <= 500
  );
}

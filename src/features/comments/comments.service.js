/**
 * 댓글 서비스 (Comments Service - 네트워크 계층).
 *
 * 현재 이 프로젝트는 `comments.storage.js`를 통해 브라우저 내부 저장소(`localStorage`)만 사용합니다.
 * 이 파일은 나중에 실제 서버(Cloudflare Workers + D1 등)에 댓글을 저장하도록
 * 연결할 때 필요한 "네트워크 요청 담당 레이어" 역할을 합니다.
 *
 * 실제 서버 연동 시 구현해야 할 목록:
 * - listComments() : 서버로부터 댓글 목록 가져오기
 * - createComment({ text }) : 서버에 새 댓글 작성 요청
 * - deleteComment({ id }) : 서버의 특정 댓글 삭제 요청
 *
 * 목표는 Controller나 View를 크게 수정하지 않고도 저장소만 바꿀 수 있도록 하는 것입니다.
 */

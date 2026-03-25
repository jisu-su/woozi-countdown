/**
 * Comments service (network layer).
 *
 * 현재 구현은 `comments.storage.js`를 통해 `localStorage`만 사용합니다.
 * 이 파일은 Issue #3(Cloudflare Workers + D1 등)로 댓글을 서버 저장소에
 * 연결할 때 필요한 "fetch 담당 레이어" 역할을 합니다.
 *
 * TODO (when ready):
 * - listComments()
 * - createComment({ text })
 * - deleteComment({ id }) or deleteComment({ index })
 *
 * Controller/View의 인터페이스를 유지하면서 storage만 교체하는 것이 목표입니다.
 */

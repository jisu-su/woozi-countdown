/**
 * 특정 댓글 삭제 API (DELETE)
 * 파일 경로: functions/api/comments/[id].js
 */

export async function onRequestDelete(context) {
  // URL에서 id 파라미터(예: /api/comments/123)를 동적으로 추출합니다.
  const { id } = context.params;

  if (!id) {
    return new Response(JSON.stringify({ error: '지워진 댓글의 ID가 없습니다.' }), { status: 400 });
  }

  try {
    // D1 데이터베이스에서 해당 id의 댓글을 삭제 처리합니다.
    await context.env.DB.prepare(
      "DELETE FROM comments WHERE id = ?"
    )
    .bind(id)
    .run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

/**
 * 댓글 목록 조회 (GET) 및 새 댓글 저장 (POST)
 * 파일 경로: functions/api/comments.js
 */

// [GET] 특정 D-Day의 댓글을 페이징 처리하여 가져옵니다.
export async function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url);
  const dday = searchParams.get('dday');       // 필수: 조회할 날짜 (D-340 등)
  const dateKey = searchParams.get('dateKey'); // 선택: YYYY-MM-DD (실제 날짜 기준)
  const limit = parseInt(searchParams.get('limit') || '10'); // 선택: 한 번에 가져올 개수 (기본 10개)
  const cursor = searchParams.get('cursor');   // 선택: 마지막으로 본 댓글의 ID (다음 데이터 가져오기용)

  if (!dday && !dateKey) {
    return new Response(JSON.stringify({ error: 'dday 또는 dateKey 파라미터가 필요합니다' }), { status: 400 });
  }

  try {
    let results;
    let dateLike1 = null;
    let dateLike2 = null;

    if (dateKey) {
      const parts = dateKey.split('-');
      if (parts.length === 3) {
        const [y, m, d] = parts;
        dateLike1 = `${y}. ${m}. ${d}%`;   // ex) 2026. 04. 07. ...
        dateLike2 = `${dateKey}%`;         // ex) 2026-04-07T...
      }
    }

    // 커서(마지막 ID)가 있는 경우: 해당 ID보다 작은(더 오래된) 데이터만 가져옴
    if (cursor) {
      let query;
      if (dateLike1 && dateLike2) {
        query = await context.env.DB.prepare(
          "SELECT * FROM comments WHERE (date LIKE ? OR date LIKE ?) AND id < ? ORDER BY id DESC LIMIT ?"
        )
        .bind(dateLike1, dateLike2, cursor, limit)
        .all();
      } else {
        query = await context.env.DB.prepare(
          "SELECT * FROM comments WHERE dday = ? AND id < ? ORDER BY id DESC LIMIT ?"
        )
        .bind(dday, cursor, limit)
        .all();
      }
      results = query.results;
    } 
    // 커서가 없는 경우 (최초 로딩): 가장 최신 데이터부터 가져옴
    else {
      let query;
      if (dateLike1 && dateLike2) {
        query = await context.env.DB.prepare(
          "SELECT * FROM comments WHERE (date LIKE ? OR date LIKE ?) ORDER BY id DESC LIMIT ?"
        )
        .bind(dateLike1, dateLike2, limit)
        .all();
      } else {
        query = await context.env.DB.prepare(
          "SELECT * FROM comments WHERE dday = ? ORDER BY id DESC LIMIT ?"
        )
        .bind(dday, limit)
        .all();
      }
      results = query.results;
    }

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

// [POST] 새로운 댓글을 데이터베이스에 저장합니다.
export async function onRequestPost(context) {
  try {
    // 클라이언트로부터 전달받은 JSON 데이터 추출
    const { dday, text, date } = await context.request.json();

    if (!dday || !text) {
      return new Response(JSON.stringify({ error: '내용이 누락되었습니다.' }), { status: 400 });
    }

    // D1 데이터베이스에 새로운 댓글 정보 삽입
    const result = await context.env.DB.prepare(
      "INSERT INTO comments (dday, text, date) VALUES (?, ?, ?)"
    )
    .bind(dday, text, date || new Date().toISOString())
    .run();

    return new Response(JSON.stringify({ success: true, id: result.lastRowId }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}


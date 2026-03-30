export async function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url);
  const dday = searchParams.get('dday');

  if (!dday) {
    return new Response(JSON.stringify({ error: 'Missing dday parameter' }), { status: 400 });
  }

  try {
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM comments WHERE dday = ? ORDER BY id DESC"
    )
    .bind(dday)
    .all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const { dday, text, date } = await context.request.json();

    if (!dday || !text) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

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

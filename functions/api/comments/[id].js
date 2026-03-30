export async function onRequestDelete(context) {
  const { id } = context.params;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id parameter' }), { status: 400 });
  }

  try {
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

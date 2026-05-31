const MND_MEALS_SERVICE = "DS_TB_MNDT_DATEBYMLSVC_ATC";
const DEFAULT_START_INDEX = 1;
const DEFAULT_END_INDEX = 300;

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });
}

export async function onRequestGet({ request, env }) {
  const apiKey = env.MND_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: "MND_API_KEY is not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const ym = searchParams.get("ym");
  if (!/^\d{6}$/.test(ym || "")) {
    return jsonResponse({ error: "Invalid ym. Expected YYYYMM." }, { status: 400 });
  }

  const startIndex = searchParams.get("start") || String(DEFAULT_START_INDEX);
  const endIndex = searchParams.get("end") || String(DEFAULT_END_INDEX);
  if (!/^\d+$/.test(startIndex) || !/^\d+$/.test(endIndex)) {
    return jsonResponse({ error: "Invalid start or end index." }, { status: 400 });
  }

  const apiUrl = new URL(
    `https://openapi.mnd.go.kr/${encodeURIComponent(apiKey)}/xml/${MND_MEALS_SERVICE}/${startIndex}/${endIndex}/`,
  );
  apiUrl.searchParams.set("YM", ym);

  const response = await fetch(apiUrl.toString(), {
    headers: {
      accept: "application/xml,text/xml,*/*",
    },
  });

  const xml = await response.text();
  if (!response.ok) {
    return new Response(xml || "Failed to fetch meals", {
      status: response.status,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });
  }

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=900",
    },
  });
}

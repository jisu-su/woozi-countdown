const MND_MEALS_SERVICE = "DS_TB_MNDT_DATEBYMLSVC_ATC";
const DEFAULT_START_INDEX = 1;
const DEFAULT_END_INDEX = 300;
const UPSTREAM_TIMEOUT_MS = 7000;

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
  const apiKey = env.MND_API_KEY?.trim();
  if (!apiKey) {
    return jsonResponse({ error: "MND_API_KEY is not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const debug = searchParams.get("debug") === "1";
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

  if (debug) {
    return jsonResponse({
      ok: true,
      keyConfigured: true,
      ym,
      startIndex,
      endIndex,
      upstreamUrlShape: `https://openapi.mnd.go.kr/[MND_API_KEY]/xml/${MND_MEALS_SERVICE}/${startIndex}/${endIndex}/?YM=${ym}`,
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  let response;

  try {
    response = await fetch(apiUrl.toString(), {
      signal: controller.signal,
      headers: {
        accept: "application/xml,text/xml,*/*",
      },
    });
  } catch (error) {
    const isTimeout = error?.name === "AbortError";
    return jsonResponse(
      {
        error: isTimeout ? "MND API request timed out" : "Failed to request MND API",
        detail: error?.message || String(error),
        ym,
      },
      { status: isTimeout ? 504 : 502 },
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const xml = await response.text();
  if (!response.ok) {
    return jsonResponse(
      {
        error: "MND API returned an error",
        upstreamStatus: response.status,
        upstreamBodyPreview: xml.slice(0, 500),
        ym,
      },
      { status: 502 },
    );
  }

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=900",
    },
  });
}

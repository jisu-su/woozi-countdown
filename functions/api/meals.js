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

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        accept: "application/xml,text/xml,*/*",
        "user-agent": "woozi-countdown-pages-function",
      },
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function probeUpstream(url, label) {
  const startedAt = Date.now();

  try {
    const response = await fetchWithTimeout(url);
    const body = await response.text();

    return jsonResponse({
      ok: response.ok,
      label,
      status: response.status,
      elapsedMs: Date.now() - startedAt,
      contentType: response.headers.get("content-type"),
      bodyPreview: body.slice(0, 500),
    });
  } catch (error) {
    const isTimeout = error?.name === "AbortError";

    return jsonResponse(
      {
        ok: false,
        label,
        error: isTimeout ? "Probe request timed out" : "Probe request failed",
        detail: error?.message || String(error),
        elapsedMs: Date.now() - startedAt,
      },
      { status: isTimeout ? 504 : 502 },
    );
  }
}

export async function onRequestGet({ request, env }) {
  const apiKey = env.MND_API_KEY?.trim();
  if (!apiKey) {
    return jsonResponse({ error: "MND_API_KEY is not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const debug = searchParams.get("debug") === "1";
  const probe = searchParams.get("probe");
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

  if (probe === "sample") {
    return probeUpstream(
      `https://openapi.mnd.go.kr/sample/xml/${MND_MEALS_SERVICE}/${startIndex}/${endIndex}/`,
      "mnd-sample",
    );
  }

  if (probe === "sample-ym") {
    const sampleUrl = new URL(`https://openapi.mnd.go.kr/sample/xml/${MND_MEALS_SERVICE}/${startIndex}/${endIndex}/`);
    sampleUrl.searchParams.set("YM", ym);
    return probeUpstream(sampleUrl.toString(), "mnd-sample-ym");
  }

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

  let response;

  try {
    response = await fetchWithTimeout(apiUrl.toString());
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

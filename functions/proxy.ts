export async function onRequest(context: { request: Request }) {
  const { request } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", {
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const requestUrl = new URL(request.url);
  const target = requestUrl.searchParams.get("url");

  if (!target) {
    return new Response("Missing url query parameter", {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(target);
  } catch {
    return new Response("Invalid url query parameter", {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  if (targetUrl.protocol !== "https:") {
    return new Response("Only https targets are allowed", {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const hostname = targetUrl.hostname.toLowerCase();
  const isAllowedHost =
    hostname === "templeosrs.com" || hostname.endsWith(".templeosrs.com");

  if (!isAllowedHost) {
    return new Response("Target host is not allowed", {
      status: 403,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const upstreamResponse = await fetch(targetUrl.toString(), {
    method: request.method,
    headers: {
      "User-Agent": "3400rs-proxy",
    },
  });

  const responseHeaders = new Headers();
  const contentType = upstreamResponse.headers.get("content-type");

  if (contentType) {
    responseHeaders.set("content-type", contentType);
  }

  responseHeaders.set("Access-Control-Allow-Origin", "*");
  responseHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  responseHeaders.set("Access-Control-Allow-Headers", "*");

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}

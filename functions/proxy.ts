export function onRequest(context: { request: Request }) {
  var request = context.request;

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

  var requestUrl = new URL(request.url);
  var target = requestUrl.searchParams.get("url");

  if (!target) {
    return new Response("Missing url query parameter", {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  var targetUrl: URL;
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

  var hostname = targetUrl.hostname.toLowerCase();
  var isAllowedHost =
    hostname === "templeosrs.com" || hostname.endsWith(".templeosrs.com");

  if (!isAllowedHost) {
    return new Response("Target host is not allowed", {
      status: 403,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  return fetch(targetUrl.toString(), {
    method: request.method,
    headers: {
      "User-Agent": "3400rs-proxy",
    },
  }).then(function (upstreamResponse) {
    var responseHeaders = new Headers();
    var contentType = upstreamResponse.headers.get("content-type");

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
  });
}

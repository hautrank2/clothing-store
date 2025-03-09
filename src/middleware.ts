import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
  const headers = new Headers(request.headers);
  const referer = headers.get("referer");
  const proto = headers.get("x-forwarded-proto");
  const host = headers.get("host");
  const domain = `${proto}://${host}`;
  const path = referer?.substring(domain.length);
  headers.set("path", path || '');
  const response = NextResponse.next({
    request: {
      headers,
    },
  });
  return response;
};

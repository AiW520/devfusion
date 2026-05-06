import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next/")) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "public, max-age=60, s-maxage=60");
  } else if (pathname.match(/\.(png|jpg|jpeg|gif|webp|avif|svg|ico|woff2|css|js)$/)) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    response.headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=86400");
  }

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: [
    "/((?!api/auth).*)",
  ],
};
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "kairo_session";

const protectedPrefixes = [
  "/dashboard",
  "/chat",
  "/history",
  "/settings",
  "/upload-xray",
  "/upload-report",
  "/upload-audio",
  "/report",
  "/pinecone",
];

const authPages = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/chat/:path*",
    "/history/:path*",
    "/settings/:path*",
    "/upload-xray/:path*",
    "/upload-report/:path*",
    "/upload-audio/:path*",
    "/report/:path*",
    "/pinecone/:path*",
    "/login",
    "/signup",
  ],
};

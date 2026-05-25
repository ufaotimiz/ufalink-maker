import { NextResponse } from "next/server";

import { auth } from "@/auth";

const PROTECTED_PREFIXES = ["/dashboard"];

export default auth((req) => {
  const isProtected = PROTECTED_PREFIXES.some((p) =>
    req.nextUrl.pathname.startsWith(p),
  );
  if (isProtected && !req.auth) {
    const url = new URL("/", req.nextUrl);
    url.searchParams.set("signin", "1");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  // Match everything except static assets, API auth routes, and Next.js internals
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};

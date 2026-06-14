import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PUBLIC_PATHS,
  ROLE_ALLOWED_PREFIXES,
  ROLE_HOME,
  USER_ROLES,
  isAllowedByPrefix,
  isUserRole,
} from "@/lib/access";

const isPublicPath = (pathname: string) => PUBLIC_PATHS.includes(pathname as (typeof PUBLIC_PATHS)[number]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const roleCookie = request.cookies.get("simdp_role")?.value;
  const role = isUserRole(roleCookie) ? roleCookie : null;

  if (pathname === "/") {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const allowedPrefixes = ROLE_ALLOWED_PREFIXES[role];
  if (!isAllowedByPrefix(pathname, allowedPrefixes)) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type UserRole = "admin" | "inventory" | "sales" | "finance" | "legal" | "supervisor";

const VALID_ROLES: UserRole[] = ["admin", "inventory", "sales", "finance", "legal", "supervisor"];
const PUBLIC_PATHS = ["/login", "/lupa-password"];

const ROLE_HOME: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  inventory: "/dashboard/inventory",
  sales: "/dashboard/sales",
  finance: "/dashboard/finance",
  legal: "/dashboard/legal",
  supervisor: "/dashboard/supervisor",
};

const ROLE_ALLOWED_PREFIXES: Record<UserRole, string[]> = {
  admin: ["/dashboard", "/crm", "/finance", "/inventory", "/keuangan", "/legal", "/proyek", "/sales", "/supervisor"],
  inventory: ["/dashboard/inventory", "/inventory", "/proyek"],
  sales: ["/dashboard/sales", "/sales", "/crm"],
  finance: ["/dashboard/finance", "/finance", "/keuangan"],
  legal: ["/dashboard/legal", "/legal"],
  supervisor: ["/dashboard/supervisor", "/supervisor", "/proyek"],
};

const isPublicPath = (pathname: string) => {
  return PUBLIC_PATHS.includes(pathname);
};

const isAllowedByPrefix = (pathname: string, prefixes: string[]) => {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const roleCookie = request.cookies.get("simdp_role")?.value;
  const role = VALID_ROLES.includes(roleCookie as UserRole) ? (roleCookie as UserRole) : null;

  if (pathname === "/") {
    if (!role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
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

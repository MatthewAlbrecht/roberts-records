import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	// Allow all /public/* routes without auth
	if (request.nextUrl.pathname.startsWith("/public")) {
		return NextResponse.next();
	}

	const session = request.cookies.get("session")?.value;

	// Protect main routes - require auth for everything except login and public routes
	const isLogin = request.nextUrl.pathname.startsWith("/login");
	const isPublic = request.nextUrl.pathname.startsWith("/public");
	const isApiAuth = request.nextUrl.pathname.startsWith("/api/auth");

	if (!isLogin && !isPublic && !isApiAuth && !session) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		url.searchParams.set("next", request.nextUrl.pathname);
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};


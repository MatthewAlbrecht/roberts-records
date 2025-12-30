"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

function getConvexUrl(): string {
	// During build, env might not be available
	if (typeof window === "undefined") {
		return process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
	}
	return process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
}

const convexUrl = getConvexUrl();
const convex = convexUrl
	? new ConvexReactClient(convexUrl)
	: new ConvexReactClient("https://placeholder.convex.cloud");

export default function ConvexClientProvider({
	children,
}: {
	children: ReactNode;
}) {
	// Don't render ConvexProvider if URL is not available
	if (!convexUrl) {
		return <>{children}</>;
	}
	return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { Toaster } from "~/components/ui/sonner";
import { AuthProvider } from "~/lib/auth-context";
import ConvexClientProvider from "~/providers/ConvexProvider";

export const metadata: Metadata = {
	title: "Robert's Records",
	description: "Track your album listening history",
	icons: [{ rel: "icon", url: "/favicon.svg" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${geist.variable}`}>
			<body>
				<AuthProvider>
					<ConvexClientProvider>
						{children}
						<Toaster />
					</ConvexClientProvider>
				</AuthProvider>
			</body>
		</html>
	);
}


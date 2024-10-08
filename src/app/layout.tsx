import { auth } from "@/auth";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";
import { ViewTransitions } from "next-view-transitions";
import { Inter } from "next/font/google";
import "./globals.css";
import "./prosemirror.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Applic - Job Application Management",
	description:
		"Applic is a job application management app that helps you track, organize, and manage your job applications with ease.",
	keywords:
		"job application, job tracker, career management, job search, interview scheduling",
	authors: [
		{
			name: "Applic Team",
			url: "https://rahulpoonia.co",
		},
	],
	openGraph: {
		title: "Applic",
		description:
			"Manage your job applications effortlessly with Applic. Track, schedule, and organize your job search.",
		url: "https://applic.rahulpoonia.co", // Website URL
		siteName: "Applic",
		images: [
			{
				url: "https://utfs.io/f/1bb820d3-18ff-47b1-a50f-e38e6d7cab40-nbw1x2.png", // URL to logo
				width: 800,
				height: 600,
				alt: "Applic Logo",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Applic",
		description:
			"Efficient job application management with Applic. Track and organize your job search with ease.",
		images: [
			{
				url: "https://utfs.io/f/1bb820d3-18ff-47b1-a50f-e38e6d7cab40-nbw1x2.png", // URL to logo
				width: 800,
				height: 600,
				alt: "Applic Logo",
			},
		],
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#f4f4f5" },
		{ media: "(prefers-color-scheme: dark)", color: "#27272A" },
	],
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();
	return (
		<html lang="en">
			<body className={inter.className + " h-svh w-svw antialiased"}>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<SessionProvider session={session}>
						<ViewTransitions>{children}</ViewTransitions>
					</SessionProvider>
					<Analytics />
					<Toaster position="top-center" />
				</ThemeProvider>
			</body>
		</html>
	);
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "DMV.gg - Ace Your DMV Test",
	description: "Ace your DMV test with our comprehensive question bank",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ClerkProvider>
					<Providers>
						<Header />
						<main className="h-fit">{children}</main>
						<Toaster />
						<Analytics />
					</Providers>
				</ClerkProvider>
			</body>
		</html>
	);
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { CookieConsentDialog } from "@/components/CookieConsentDialog";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "DMV.gg - Ace Your DMV Test",
	description: "Ace your DMV test with our comprehensive question bank",
	openGraph: {
		title: "DMV.gg - Ace Your DMV Test",
		description: "Ace your DMV test with our comprehensive question bank",
		url: "https://dmv.gg",
		siteName: "DMV.gg",
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "DMV.gg - Ace Your DMV Test",
		description: "Ace your DMV test with our comprehensive question bank",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<body className={`${inter.className} bg-[#000099]`}>
					<Providers>
						<Header />
						{children}
						<div className="relative z-[120]">
							<Toaster />
						</div>
						<CookieConsentDialog />
						<Analytics />
					</Providers>
				</body>
			</html>
		</ClerkProvider>
	);
}

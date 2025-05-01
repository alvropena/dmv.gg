import type { Metadata } from "next";
import { Baloo_Bhai_2 } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/contexts/AuthContext";

const balooBhai2 = Baloo_Bhai_2({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
	title: "DMV.gg - Ace your DMV Knowledge Test",
	description: "Ace your DMV test with our comprehensive question bank",
	openGraph: {
		title: "DMV.gg - Ace your DMV Knowledge Test",
		description: "Ace your DMV test with our comprehensive question bank",
		url: "https://dmv.gg",
		siteName: "DMV.gg",
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "DMV.gg - Ace your DMV Knowledge Test",
		description: "Ace your DMV test with our comprehensive question bank",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider afterMultiSessionSingleSignOutUrl='/'>
			<html lang="en" suppressHydrationWarning>
				<body className={`${balooBhai2.className} bg-[#000099]`}>
					<AuthProvider>
						{children}
						<div className="relative z-[120]">
							<Toaster />
						</div>
						{/* <CookieConsentDialog /> */}
						<Analytics />
					</AuthProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}

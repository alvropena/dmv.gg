"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function RootPage() {
	const { user, isLoaded } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (isLoaded && user) {
			router.push("/home");
		}
	}, [isLoaded, user, router]);

	if (!isLoaded) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	// If not authenticated, render the landing page content directly
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-1">
				<Hero />
				<Features />
				<Testimonials />
				<FAQ />
				<CTA />
			</main>
			<Footer />
		</div>
	);
}

"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import PricingSection from "@/components/landing/PricingSection";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function RootPage() {
	const { user, isLoaded } = useUser();
	const router = useRouter();

	const footerRef = useRef<HTMLDivElement>(null);
	const featuresRef = useRef<HTMLDivElement>(null);
	const [featuresVisible, setFeaturesVisible] = useState(false);

	useEffect(() => {
		if (!featuresRef.current) return;
		const observer = new window.IntersectionObserver(
			([entry]) => setFeaturesVisible(entry.intersectionRatio > 0.5),
			{ threshold: 0.5 }
		);
		observer.observe(featuresRef.current);
		return () => observer.disconnect();
	}, []);

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
				<Hero hideArrow={featuresVisible} />
				<Features ref={featuresRef} />
				<PricingSection />
				<Testimonials />
				<FAQ />
				<CTA />
			</main>
			<div ref={footerRef}>
				<Footer />
			</div>
		</div>
	);
}

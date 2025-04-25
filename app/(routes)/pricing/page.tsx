"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/landing/Footer";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Price {
	id: string;
	name: string;
	description: string;
	unitAmount: number;
	currency: string;
	type: "recurring" | "one_time";
	interval?: "day" | "week" | "month" | "year";
	features: string[];
	metadata: Record<string, string>;
}

export default function PricingPage() {
	const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
	const [prices, setPrices] = useState<Price[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPrices = async () => {
			try {
				setLoading(true);
				const response = await fetch("/api/prices");
				if (!response.ok) throw new Error("Failed to fetch prices");
				const data = await response.json();
				setPrices(data);

				// Default to monthly plan if available
				const monthlyPlan = data.find((p: Price) => p.interval === "month");
				if (monthlyPlan) {
					setSelectedPlan(monthlyPlan.name);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load pricing data",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchPrices();
	}, []);

	const handlePlanSelect = async (plan: string) => {
		try {
			const response = await fetch("/api/create-checkout-session", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					plan: plan.toLowerCase(),
				}),
			});

			const data = await response.json();

			if (data.url) {
				window.location.href = data.url;
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	if (loading) {
		return (
			<>
				<Header />
				<div className="container mx-auto px-4 py-4">
					<div className="flex justify-center items-center min-h-[60vh]">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
					</div>
				</div>
				<Footer />
			</>
		);
	}

	if (error) {
		return (
			<>
				<Header />
				<div className="container mx-auto px-4 py-4">
					<div className="flex flex-col items-center justify-center min-h-[60vh]">
						<p className="text-red-500 mb-4">Error: {error}</p>
						<Button onClick={() => window.location.reload()}>Try Again</Button>
					</div>
				</div>
				<Footer />
			</>
		);
	}

	return (
		<>
			<Header />
			<div className="container mx-auto px-4 py-4">
				<div className="text-center mb-16">
					<h1 className="text-5xl font-extrabold tracking-tighter text-white md:text-6xl lg:text-7xl xl:text-8xl mb-4">
						Choose Your Study Plan
					</h1>
					<p className="text-white md:text-md/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
						Choose the plan that works best for you
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{prices.map((price) => {
						const isMonthly = price.interval === "month";
						const amount = formatCurrency(price.unitAmount || 0, price.currency);
						const interval = price.interval
							? `/ ${price.interval}`
							: "";

						return (
							<div
								key={price.id}
								className={`rounded-2xl border p-8 transition-all bg-[#B6DBFF]/10 backdrop-blur-sm border-white/10 flex flex-col relative ${
									selectedPlan === price.name
										? `${isMonthly ? "border-blue-600" : "border-primary"} shadow-lg scale-105`
										: "hover:border-primary/50"
								}`}
							>
								{isMonthly && (
									<div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
										<div className="bg-[#FFF25F] text-[#3F3500] text-sm px-8 py-2 rounded-full font-semibold">
											Most popular
										</div>
									</div>
								)}
								<div>
									<h2 className="text-2xl font-bold mb-2 text-white">{price.name}</h2>
									<div className="flex items-baseline mb-4">
										<span className="text-4xl font-bold text-white">{amount}</span>
										<span className="text-white/70 ml-2">
											{interval}
										</span>
									</div>
									<p className="text-white/70">{price.description}</p>
								</div>

								<ul className="space-y-4 my-8 flex-grow">
									{price.features.map((feature) => (
										<li key={feature} className="flex items-center gap-3">
											<div className="h-4 w-4 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0">
												<svg
													width="10"
													height="10"
													viewBox="0 0 10 10"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
													className="text-green-600"
												>
													<path
														d="M1.5 5.5L3.5 7.5L8.5 2.5"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</div>
											<span className="text-white">{feature}</span>
										</li>
									))}
								</ul>

								<Button
									className={`w-full rounded-full font-bold mt-auto px-6 py-4 h-auto text-lg ${
										selectedPlan === price.name ? "bg-[#FFF25F] hover:bg-[#FFF25F]/90 text-[#3F3500]" : "text-black"
									}`}
									variant={selectedPlan === price.name ? "default" : "outline"}
									onClick={() => {
										setSelectedPlan(price.name);
										handlePlanSelect(price.name);
									}}
								>
									Get started
								</Button>
							</div>
						);
					})}
				</div>

				<div className="text-center mt-8">
					<p className="text-white">
						All plans include access to our comprehensive DMV test preparation
						materials.
						<br />
						Need help choosing?{" "}
						<a href="/contact" className="underline text-white">
							Contact us
						</a>
					</p>
				</div>
			</div>
			<Footer />
		</>
	);
}

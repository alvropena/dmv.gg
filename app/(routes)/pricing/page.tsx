"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/landing/Footer";

const pricingTiers = [
	{
		name: "Weekly",
		price: "$9.99",
		description: "Perfect for short-term preparation",
		features: [
			"Full access to all practice tests",
			"Unlimited test attempts",
			"Progress tracking",
			"DMV handbook access",
			"7-day money-back guarantee",
		],
	},
	{
		name: "Monthly",
		price: "$19.99",
		description: "Most popular for serious learners",
		features: [
			"Everything in Weekly plan",
			"Priority support",
			"Study streak tracking",
			"Performance analytics",
			"30-day money-back guarantee",
		],
	},
	{
		name: "Lifetime",
		price: "$99.99",
		description: "Best value for long-term access",
		features: [
			"Everything in Monthly plan",
			"Lifetime updates",
			"Exclusive content",
			"Premium support",
			"90-day money-back guarantee",
		],
	},
];

export default function PricingPage() {
	const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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

	return (
		<>
			<Header />
			<div className="container mx-auto px-4 py-4">
				<div className="text-center mb-16">
					<h1 className="text-5xl font-extrabold tracking-tighter text-[#B6DBFF] md:text-6xl lg:text-7xl xl:text-8xl mb-4">
						Simple, Transparent Pricing
					</h1>
					<p className="text-[#B6DBFF] md:text-md/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
						Choose the plan that works best for you
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{pricingTiers.map((tier) => (
						<div
							key={tier.name}
							className={`rounded-2xl border p-8 transition-all bg-white ${
								selectedPlan === tier.name
									? "border-primary shadow-lg scale-105"
									: "border-border hover:border-primary/50"
							}`}
						>
							<div className="mb-8">
								<h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
								<div className="flex items-baseline mb-4">
									<span className="text-4xl font-bold">{tier.price}</span>
									{tier.name !== "Lifetime" && (
										<span className="text-muted-foreground ml-2">
											/ {tier.name.toLowerCase()}
										</span>
									)}
								</div>
								<p className="text-muted-foreground">{tier.description}</p>
							</div>

							<ul className="space-y-4 mb-8">
								{tier.features.map((feature) => (
									<li key={feature} className="flex items-center gap-3">
										<Check className="h-5 w-5 text-primary flex-shrink-0" />
										<span>{feature}</span>
									</li>
								))}
							</ul>

							<Button
								className="w-full"
								variant={selectedPlan === tier.name ? "default" : "outline"}
								onClick={() => {
									setSelectedPlan(tier.name);
									handlePlanSelect(tier.name);
								}}
							>
								Get Started
							</Button>
						</div>
					))}
				</div>

				<div className="text-center mt-8">
					<p className="text-white">
						All plans include access to our comprehensive DMV test preparation
						materials.
						<br />
						Need help choosing?{" "}
						<a href="/contact" className="text-primary hover:underline">
							Contact us
						</a>
					</p>
				</div>
			</div>
			<Footer />
		</>
	);
}

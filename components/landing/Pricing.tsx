"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useIsMobile";
import { SignInDialog } from "@/components/SignInDialog";

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

export default function Pricing() {
	const [prices, setPrices] = useState<Price[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedPlan, setSelectedPlan] = useState<
		"weekly" | "monthly" | "lifetime" | null
	>(null);
	const [isSignInOpen, setIsSignInOpen] = useState(false);
	const isMobile = useIsMobile();

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
					setSelectedPlan("monthly");
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

	const getPlanType = (price: Price): "weekly" | "monthly" | "lifetime" => {
		if (price.type === "one_time") return "lifetime";
		if (price.interval === "week") return "weekly";
		return "monthly";
	};

	const handleGetStarted = () => {
		setIsSignInOpen(true);
	};

	const renderPriceCard = (price: Price) => {
		const planType = getPlanType(price);
		const isSelected = selectedPlan === planType;
		const isPopular = planType === "monthly";
		const amount = formatCurrency(price.unitAmount || 0, price.currency);
		const interval = price.interval
			? `per ${price.interval}`
			: "one-time payment";

		return (
			<div
				key={price.id}
				className={`border rounded-lg p-6 flex flex-col relative ${
					isSelected ? "border-primary border-2" : ""
				}`}
			>
				{isPopular && (
					<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
						<Badge variant="default">Most Popular</Badge>
					</div>
				)}
				<h3 className="font-semibold text-3xl text-center text-white">
					{price.name.replace("DMV.gg ", "")}
				</h3>
				<div className="flex items-baseline mt-4">
					<span className="text-3xl font-bold text-white">{amount}</span>
					<span className="ml-1 text-xs text-white">{interval}</span>
				</div>
				<p className="text-sm mt-2 text-white">{price.description}</p>
				<div className="flex-grow mt-6 space-y-4">
					{price.features && price.features.length > 0 ? (
						price.features.map((feature) => (
							<div key={feature} className="flex items-center gap-2">
								<Check className="h-4 w-4 flex-shrink-0 text-white" />
								<span className="text-sm text-white">{feature}</span>
							</div>
						))
					) : (
						<div className="text-sm text-white">No features specified</div>
					)}
				</div>
				<Button
					variant={
						isSelected
							? "default"
							: planType === "monthly"
								? "default"
								: "outline"
					}
					className="mt-6"
					onClick={() => {
						setSelectedPlan(planType);
						handleGetStarted();
					}}
				>
					Get Started
				</Button>
			</div>
		);
	};

	const renderMobileContent = () => {
		return (
			<div className="space-y-6">
				{/* Plan selection cards */}
				<div className="grid grid-cols-3 gap-2">
					{prices.filter((p) => getPlanType(p) === "weekly").length > 0 && (
						<Card
							className={`flex flex-col items-center justify-center py-2 px-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow rounded-md ${
								selectedPlan === "weekly" ? "border-primary border-2" : ""
							}`}
							onClick={() => setSelectedPlan("weekly")}
						>
							<div className="text-xs text-center text-white">Weekly</div>
							{prices.find((p) => getPlanType(p) === "weekly") && (
								<div className="font-bold text-sm text-center text-white">
									{formatCurrency(
										prices.find((p) => getPlanType(p) === "weekly")
											?.unitAmount || 0,
										prices.find((p) => getPlanType(p) === "weekly")?.currency ||
											"usd",
									)}
									/wk
								</div>
							)}
						</Card>
					)}

					<Card
						className={`flex flex-col items-center justify-center py-2 px-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow rounded-md ${
							selectedPlan === "monthly" ? "border-primary border-2" : ""
						}`}
						onClick={() => setSelectedPlan("monthly")}
					>
						<div className="text-xs text-center text-white">Monthly</div>
						{prices.find((p) => getPlanType(p) === "monthly") && (
							<div className="font-bold text-sm text-center text-white">
								{formatCurrency(
									prices.find((p) => getPlanType(p) === "monthly")
										?.unitAmount || 0,
									prices.find((p) => getPlanType(p) === "monthly")?.currency ||
										"usd",
								)}
								/mo
							</div>
						)}
					</Card>

					<Card
						className={`flex flex-col items-center justify-center py-2 px-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow rounded-md ${
							selectedPlan === "lifetime" ? "border-primary border-2" : ""
						}`}
						onClick={() => setSelectedPlan("lifetime")}
					>
						<div className="text-xs text-center text-white">Lifetime</div>
						{prices.find((p) => getPlanType(p) === "lifetime") && (
							<div className="font-bold text-sm text-center text-white">
								{formatCurrency(
									prices.find((p) => getPlanType(p) === "lifetime")
										?.unitAmount || 0,
									prices.find((p) => getPlanType(p) === "lifetime")?.currency ||
										"usd",
								)}
							</div>
						)}
					</Card>
				</div>

				{/* Selected plan features */}
				{selectedPlan && prices.length > 0 && (
					<Card className="p-6">
						<h3 className="font-semibold mb-4 text-white">Included Features:</h3>
						<div className="space-y-2">
							{prices
								.find((p) => getPlanType(p) === selectedPlan)
								?.features?.map((feature) => (
									<div key={feature} className="flex items-center gap-2">
										<Check className="h-4 w-4 flex-shrink-0 text-white" />
										<span className="text-sm text-white">{feature}</span>
									</div>
								))}
						</div>
						<Button className="w-full mt-6" onClick={handleGetStarted}>
							Get Started
						</Button>
					</Card>
				)}
			</div>
		);
	};

	if (loading) {
		return (
			<section id="pricing" className="w-full py-16 md:py-20 lg:py-24">
				<div className="container mx-auto px-4">
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2" />
					</div>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section id="pricing" className="w-full py-16 md:py-20 lg:py-24">
				<div className="container mx-auto px-4">
					<div className="flex flex-col items-center h-64 justify-center">
						<p>Error: {error}</p>
						<Button onClick={() => window.location.reload()} className="mt-4">
							Try Again
						</Button>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section id="pricing" className="w-full py-16 md:py-20 lg:py-24">
			<div className="container mx-auto px-4">
				<div className="flex flex-col items-start justify-center space-y-4 text-left">
					<div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
							Choose Your Plan
						</h2>
						<p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-white">
							Select the plan that works best for you. Cancel anytime.
						</p>
					</div>
				</div>
				<div className="mx-auto max-w-5xl mt-8">
					{isMobile ? (
						renderMobileContent()
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{prices.map(renderPriceCard)}
						</div>
					)}
				</div>
			</div>
			<SignInDialog
				isOpen={isSignInOpen}
				onClose={() => setIsSignInOpen(false)}
			/>
		</section>
	);
}

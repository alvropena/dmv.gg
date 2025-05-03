import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Card } from "@/components/ui/card";
import { usePostHog } from 'posthog-js/react';


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

interface PricingDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onPlanSelect: (plan: "weekly" | "monthly" | "lifetime") => void;
}

export function PricingDialog({
	isOpen,
	onClose,
	onPlanSelect,
}: PricingDialogProps) {
	const [prices, setPrices] = useState<Price[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedPlan, setSelectedPlan] = useState<
		"weekly" | "monthly" | "lifetime" | null
	>(null);
	const isMobile = useIsMobile();
	const posthog = usePostHog();

	useEffect(() => {
		const fetchPrices = async () => {
			try {
				setLoading(true);
				const response = await fetch("/api/prices");
				if (!response.ok) throw new Error("Failed to fetch prices");
				const data = await response.json();
				setPrices(data);

				// Check for plan options and set a default
				const weeklyPlan = data.find((p: Price) => p.interval === "week");
				const monthlyPlan = data.find((p: Price) => p.interval === "month");
				const lifetimePlan = data.find((p: Price) => p.type === "one_time");

				// Set a default plan - prioritize in this order: monthly, weekly, lifetime
				if (monthlyPlan) {
					setSelectedPlan("monthly");
				} else if (weeklyPlan) {
					setSelectedPlan("weekly");
				} else if (lifetimePlan) {
					setSelectedPlan("lifetime");
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load pricing data",
				);
			} finally {
				setLoading(false);
			}
		};

		if (isOpen) {
			fetchPrices();
		}
	}, [isOpen]);

	useEffect(() => {
		if (!posthog) return;
		if (isOpen) {
			posthog.capture('pricing_dialog_opened');
		} else {
			posthog.capture('pricing_dialog_closed');
		}
	}, [isOpen, posthog]);

	const getPlanType = (price: Price): "weekly" | "monthly" | "lifetime" => {
		if (price.type === "one_time") return "lifetime";
		if (price.interval === "week") return "weekly";
		return "monthly";
	};

	const renderPriceCard = (price: Price) => {
		const planType = getPlanType(price);
		const isSelected = selectedPlan === planType;
		const isPopular = planType === "monthly";
		const amount = formatCurrency(price.unitAmount || 0, price.currency);
		const interval = price.interval
			? `/ per ${price.interval}`
			: "one-time payment";

		return (
			<div
				key={price.id}
				className={`border rounded-lg p-6 flex flex-col relative ${
					isSelected ? `${planType === "monthly" ? "border-blue-600" : "border-primary"} border-2` : ""
				}`}
			>
				{isPopular && (
					<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
						<Badge className="bg-blue-600 hover:bg-blue-700 rounded-full">Most Popular</Badge>
					</div>
				)}
				<h3 className="font-semibold text-3xl text-center">
					{price.name.replace("DMV.gg ", "")}
				</h3>
				<div className="flex items-baseline mt-4">
					<span className="text-3xl font-bold">{amount}</span>
					<span className="text-muted-foreground ml-1 text-xs">{interval}</span>
				</div>
				<p className="text-sm text-muted-foreground mt-2">
					{price.description}
				</p>
				<div className="flex-grow mt-6 space-y-4">
					{price.features && price.features.length > 0 ? (
						price.features.map((feature) => (
							<div key={feature} className="flex items-center gap-3">
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
								<span className="text-sm">{feature}</span>
							</div>
						))
					) : (
						<div className="text-sm text-muted-foreground">
							No features specified
						</div>
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
					className='mt-6 rounded-full font-bold'
					onClick={() => {
						posthog?.capture('pricing_get_started_clicked', { planType });
						setSelectedPlan(planType);
						onPlanSelect(planType);
					}}
				>
					Get Started
				</Button>
			</div>
		);
	};

	const renderMobileContent = () => {
		return (
			<DialogContent className="p-0 overflow-hidden max-w-sm w-[90%] mx-auto rounded-md">
				<div className="flex flex-col h-full">
					{/* Content section */}
					<div className="p-6 pb-2 flex flex-col">
						<DialogTitle className="text-xl font-bold mb-1">Begin your DMV journey</DialogTitle>
						<p className="text-gray-600 text-sm mb-4">
							Unlock the test preparation you need
						</p>

						{/* Features list */}
						<div className="space-y-2 mb-4">
							{selectedPlan &&
								prices.length > 0 &&
								prices
									.find((p) => getPlanType(p) === selectedPlan)
									?.features?.map((feature) => (
										<div key={feature} className="flex items-center gap-3">
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
											<span className="text-sm">{feature}</span>
										</div>
									))}
						</div>

						{/* Plan selection - updated grid layout based on available plans */}
						<div className="grid grid-cols-3 gap-1 mb-4">
							{prices.filter((p) => getPlanType(p) === "weekly").length > 0 && (
								<Card
									className={`flex flex-col items-center justify-center py-2 px-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow rounded-full ${
										selectedPlan === "weekly" ? "border-blue-600 border-2" : ""
									}`}
									onClick={() => {
										setSelectedPlan("weekly");
									}}
								>
									<div className="text-xs text-center">Weekly</div>
									{prices.find((p) => getPlanType(p) === "weekly") && (
										<div className="font-bold text-[11px] text-center">
											{formatCurrency(
												prices.find((p) => getPlanType(p) === "weekly")
													?.unitAmount || 0,
												prices.find((p) => getPlanType(p) === "weekly")
													?.currency || "usd",
											)}
											/wk
										</div>
									)}
								</Card>
							)}

							{prices.filter((p) => getPlanType(p) === "monthly").length > 0 && (
								<Card
									className={`flex flex-col items-center justify-center py-2 px-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow rounded-full ${
										selectedPlan === "monthly" ? "border-blue-600 border-2" : ""
									}`}
									onClick={() => {
										setSelectedPlan("monthly");
									}}
								>
									<div className="text-xs text-center">Monthly</div>
									{prices.find((p) => getPlanType(p) === "monthly") && (
										<div className="font-bold text-[11px] text-center">
											{formatCurrency(
												prices.find((p) => getPlanType(p) === "monthly")
													?.unitAmount || 0,
												prices.find((p) => getPlanType(p) === "monthly")
													?.currency || "usd",
											)}
											/mo
										</div>
									)}
								</Card>
							)}

							{prices.filter((p) => getPlanType(p) === "lifetime").length > 0 && (
								<Card
									className={`flex flex-col items-center justify-center py-2 px-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow rounded-full ${
										selectedPlan === "lifetime" ? "border-blue-600 border-2" : ""
									}`}
									onClick={() => {
										setSelectedPlan("lifetime");
									}}
								>
									<div className="text-xs text-center">Lifetime</div>
									{prices.find((p) => getPlanType(p) === "lifetime") && (
										<div className="font-bold text-[11px] text-center">
											{formatCurrency(
												prices.find((p) => getPlanType(p) === "lifetime")
													?.unitAmount || 0,
												prices.find((p) => getPlanType(p) === "lifetime")
													?.currency || "usd",
											)}
										</div>
									)}
								</Card>
							)}
						</div>

						{/* Continue button */}
						<Button
							className="w-full mb-2 rounded-full font-bold"
							onClick={() => {
								if (selectedPlan) {
									onPlanSelect(selectedPlan);
								}
							}}
						>
							Continue
						</Button>
					</div>
				</div>
			</DialogContent>
		);
	};

	const renderDesktopContent = () => {
		return (
			<DialogContent className="sm:max-w-[900px]">
				<div className="flex flex-col items-center">
					<DialogTitle className="text-3xl font-bold mb-1">Choose Your Plan</DialogTitle>
					<p className="text-muted-foreground text-lg">
						Select the plan that works best for you. Cancel anytime.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{prices.map(renderPriceCard)}
				</div>
			</DialogContent>
		);
	};

	if (loading) {
		return (
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent
					className={isMobile ? "max-w-sm mx-auto" : "sm:max-w-[900px]"}
				>
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	if (error) {
		return (
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent
					className={isMobile ? "max-w-sm mx-auto" : "sm:max-w-[900px]"}
				>
					<div className="flex flex-col items-center h-64 justify-center">
						<p className="text-red-500">Error: {error}</p>
						<Button onClick={() => window.location.reload()} className="mt-4 rounded-full">
							Try Again
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			{isMobile ? renderMobileContent() : renderDesktopContent()}
		</Dialog>
	);
}

"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import growthbook, { trackEvent } from "@/lib/growthbook";
import { v4 as uuidv4 } from 'uuid';
import { Price, prices } from "@/data/pricing";

export default function PricingSection() {
	const router = useRouter();
	const { user } = useClerk();
	const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

	useEffect(() => {
		let anonId: string | null = null;
		if (typeof window !== 'undefined') {
			anonId = localStorage.getItem('anonId');
			if (!anonId) {
				anonId = uuidv4();
				localStorage.setItem('anonId', anonId);
			}
		}

		growthbook.setAttributes({
			id: user?.id || anonId || '',
			email: user?.emailAddresses[0]?.emailAddress,
			createdAt: user?.createdAt,
		});

		// Set default selected plan to Monthly
		setSelectedPlan(prices[1].name);
	}, [user]);

	const handlePlanSelect = (price: Price) => {
		// Track the plan selection
		trackEvent("plan_selected", {
			plan: price.name,
			price: price.unitAmount,
			variation: price.metadata.variation,
			userId: user?.id || 'anonymous',
		});
		
		setSelectedPlan(price.name);
		router.push("/sign-up");
	};

	return (
		<section id="pricing" className="w-full py-12 md:py-12 lg:py-52 bg-[#1C1F2A]">
			<div className="container mx-auto px-4 py-4">
				<div className="text-center mb-16">
					<h2 className="text-5xl font-extrabold tracking-tighter text-white md:text-6xl lg:text-7xl xl:text-8xl mb-4">
						Choose Your Study Plan
					</h2>
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
								{isMonthly && price.name === "Pro" && (
									<div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
										<div className="bg-[#FFF25F] text-[#3F3500] text-sm px-8 py-2 rounded-full font-semibold">
											Most popular
										</div>
									</div>
								)}
								<div>
									<h3 className="text-2xl font-bold mb-2 text-white">{price.name}</h3>
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
									onClick={() => handlePlanSelect(price)}
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
						<a href="mailto:support@dmv.gg" className="underline text-white">
							Contact us
						</a>
					</p>
				</div>
			</div>
		</section>
	);
} 
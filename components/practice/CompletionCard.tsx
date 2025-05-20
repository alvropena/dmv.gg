"use client"

import { useState, useEffect, useRef } from "react"
import { Clock, CheckCircle2, TrendingUp } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { usePostHog } from "posthog-js/react"

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

interface CompletionCardProps {
	onReturnHome: () => void;
	score: number;
	totalQuestions: number;
	isPass: boolean;
	onUnlockAllTests?: () => void;
}

export function CompletionCard({ onReturnHome, score, totalQuestions, isPass, onUnlockAllTests }: CompletionCardProps) {
	const [selectedPlan, setSelectedPlan] = useState<"weekly" | "monthly" | "lifetime">("monthly")
	const [prices, setPrices] = useState<Price[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [timeLeft, setTimeLeft] = useState(420) // 7 minutes in seconds
	const timerRef = useRef<NodeJS.Timeout | null>(null)
	const pointsNeeded = isPass ? 0 : Math.ceil(totalQuestions * 0.8) - score
	const posthog = usePostHog()

	// Timer logic
	useEffect(() => {
		if (timeLeft <= 0) return
		timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	}, [timeLeft])

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
		const s = seconds % 60
		return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
	}

	useEffect(() => {
		const fetchPrices = async () => {
			try {
				setLoading(true)
				const response = await fetch("/api/prices")
				if (!response.ok) throw new Error("Failed to fetch prices")
				const data = await response.json()
				setPrices(data)

				// Set default plan to monthly if available
				const monthlyPlan = data.find((p: Price) => p.interval === "month")
				if (monthlyPlan) {
					setSelectedPlan("monthly")
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load pricing data")
			} finally {
				setLoading(false)
			}
		}

		fetchPrices()
	}, [])

	const getPlanType = (price: Price): "weekly" | "monthly" | "lifetime" => {
		if (price.type === "one_time") return "lifetime"
		if (price.interval === "week") return "weekly"
		return "monthly"
	}

	const getSelectedPrice = () => {
		return prices.find(p => getPlanType(p) === selectedPlan)
	}

	const handleGetStarted = async () => {
		const selectedPrice = getSelectedPrice()
		if (!selectedPrice) return

		try {
			posthog?.capture("pricing_get_started_clicked", { planType: selectedPlan })
			
			const response = await fetch("/api/create-checkout-session", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					plan: selectedPlan,
				}),
			})

			if (!response.ok) throw new Error("Failed to create checkout session")

			const { url } = await response.json()
			window.location.href = url
		} catch (error) {
			console.error("Error creating checkout session:", error)
			// You might want to show an error message to the user here
		}
	}

	// Update DonutChart to be smaller and vertically centered
	const DonutChart = ({ correct, total }: { correct: number; total: number }) => {
		const radius = 40;
		const stroke = 10;
		const normalizedRadius = radius - stroke / 2;
		const circumference = normalizedRadius * 2 * Math.PI;
		const correctPercent = correct / total;
		const errorPercent = 1 - correctPercent;
		const correctStroke = circumference * correctPercent;
		const errorStroke = circumference * errorPercent;
		return (
			<svg height={radius * 2} width={radius * 2} style={{ display: 'block' }}>
				{/* Background circle */}
				<circle
					stroke="#e5e7eb"
					fill="white"
					strokeWidth={stroke}
					r={normalizedRadius}
					cx={radius}
					cy={radius}
				/>
				{/* Correct answers arc */}
				<circle
					stroke="#22c55e"
					fill="transparent"
					strokeWidth={stroke}
					strokeDasharray={`${correctStroke} ${circumference - correctStroke}`}
					strokeDashoffset={circumference * 0.25}
					r={normalizedRadius}
					cx={radius}
					cy={radius}
					style={{ transition: 'stroke-dasharray 0.5s' }}
				/>
				{/* Errors arc */}
				<circle
					stroke="#ef4444"
					fill="transparent"
					strokeWidth={stroke}
					strokeDasharray={`${errorStroke} ${circumference - errorStroke}`}
					strokeDashoffset={circumference * 0.25 + correctStroke}
					r={normalizedRadius}
					cx={radius}
					cy={radius}
					style={{ transition: 'stroke-dasharray 0.5s' }}
				/>
				{/* Center text */}
				<text
					x="50%"
					y="50%"
					textAnchor="middle"
					dy="0.35em"
					fontSize="20"
					fontWeight="bold"
					fill="#000099"
				>
					{correct}/{total}
				</text>
			</svg>
		);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-200 px-4">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#000099]" />
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-200 px-4">
				<div className="text-[#000099]">Error loading pricing data</div>
			</div>
		)
	}

	const selectedPrice = getSelectedPrice()

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-200 px-4">
			<Card className="w-full max-w-md md:max-w-xl lg:max-w-2xl overflow-hidden border-0 rounded-2xl p-0 md:p-8">
				<div className="w-full px-6 pt-6 pb-0">
					<div className="mb-4">
						<div className="flex justify-between items-center">
							<div>
								<h3 className="text-2xl font-extrabold">Almost there!</h3>
								<p className="text-lg font-semibold opacity-90 mt-1">You need {pointsNeeded} more points to pass to succeed.</p>
							</div>
							<div className="flex items-center h-full">
								<DonutChart correct={score} total={totalQuestions} />
							</div>
						</div>
					</div>
					<div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
						<div className="flex items-start gap-2">
							<TrendingUp className="h-4 w-4 text-amber-600 mt-0.5" />
							<div>
								<p className="text-sm font-medium text-amber-800">
									<span className="font-bold">80% of users</span> improve their scores by 2x with our
								</p>
								<p className="text-sm font-medium text-amber-800">Weak Areas Focus Mode</p>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-6">
						<div className="border rounded-md p-3 mb-6">
							{selectedPrice?.features.map((feature, index) => (
								<div key={index} className="flex items-center gap-1.5">
									<CheckCircle2 className="h-4 w-4 text-green-600" />
									<span className="text-sm">{feature}</span>
								</div>
							))}
						</div>

						<div className="flex flex-col md:flex-row gap-4 justify-center items-stretch mb-4">
							{['weekly', 'monthly', 'lifetime'].map((plan) => {
								const planPrice = prices.find(p => getPlanType(p) === plan)
								const isSelected = selectedPlan === plan
								return (
									<div
										key={plan}
										className={`relative flex-1 border rounded-lg p-4 cursor-pointer transition-all duration-150 ${isSelected ? 'border-[#000099] shadow-lg bg-gray-50' : 'border-gray-300 bg-white'} flex flex-col items-start justify-between min-w-[140px]`}
										onClick={() => setSelectedPlan(plan as any)}
									>
										{plan === 'monthly' && (
											<span className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 bg-[#000099] text-white text-xs font-bold px-3 py-1 rounded-full shadow">Best value</span>
										)}
										<div className="flex items-center w-full justify-between mb-2">
											<span className="font-bold text-base uppercase">{plan}</span>
											{isSelected && (
												<span className="inline-block ml-2 text-[#000099]">
													<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#000099"/><path d="M8 12.5l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
												</span>
											)}
										</div>
										{planPrice && (
											<>
												<div className="text-sm text-muted-foreground line-through">
													{formatCurrency(planPrice.unitAmount * 2, planPrice.currency)}
												</div>
												<div className="text-xl font-bold mb-1">
													{formatCurrency(planPrice.unitAmount, planPrice.currency)}
													<span className="text-sm text-muted-foreground ml-1">
														{planPrice.type === "one_time" ? '' : `/ ${planPrice.interval}`}
													</span>
												</div>
												{planPrice.metadata?.subtext && (
													<div className="text-xs text-muted-foreground">{planPrice.metadata.subtext}</div>
												)}
											</>
										)}
									</div>
								)
							})}
						</div>
					</div>
				</div>
				<CardFooter className="flex flex-col p-4 pt-0 gap-2">
					<Button 
						className="w-full bg-[#000099] hover:bg-[#0000cc]"
						onClick={handleGetStarted}
					>
						Get Started Today
					</Button>
					<Button 
						variant="ghost" 
						className="w-full text-sm"
						onClick={onReturnHome}
					>
						No thanks, return to home
					</Button>
					<p className="text-xs text-center text-muted-foreground mt-1">
						Cancel anytime. Secure payment. No hidden fees.
					</p>
				</CardFooter>
			</Card>
		</div>
	)
}

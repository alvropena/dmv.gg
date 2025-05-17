"use client"

import { useState, useEffect } from "react"
import { Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Header } from "./completion-card/Header"
import { Features } from "./completion-card/Features"
import { PlanSelection } from "./completion-card/PlanSelection"

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
	const [minutes, setMinutes] = useState(7)
	const [seconds, setSeconds] = useState(5)
	const [selectedPlan, setSelectedPlan] = useState<"weekly" | "monthly" | "annual">("monthly")
	const [prices, setPrices] = useState<Price[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchPrices = async () => {
			try {
				setLoading(true)
				const response = await fetch("/api/prices")
				if (!response.ok) throw new Error("Failed to fetch prices")
				const data = await response.json()
				setPrices(data)
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load pricing data")
			} finally {
				setLoading(false)
			}
		}

		fetchPrices()
	}, [])

	useEffect(() => {
		const timer = setInterval(() => {
			if (seconds > 0) {
				setSeconds(seconds - 1)
			} else if (minutes > 0) {
				setMinutes(minutes - 1)
				setSeconds(59)
			} else {
				clearInterval(timer)
			}
		}, 1000)

		return () => clearInterval(timer)
	}, [minutes, seconds])

	const pointsNeeded = isPass ? 0 : Math.ceil(totalQuestions * 0.8) - score

	return (
		<div className="flex items-center justify-center min-h-screen bg-[#000099] p-4">
			<Card className="w-full max-w-md overflow-hidden shadow-2xl border-0">
				<Header
					minutes={minutes}
					seconds={seconds}
					score={score}
					totalQuestions={totalQuestions}
					isPass={isPass}
				/>

				<CardContent>
					<div className="flex flex-col items-center text-center mb-6">
						<h3 className="text-lg font-semibold mb-1">
							{isPass 
								? "Great job! Keep improving with premium features"
								: `You need ${pointsNeeded} more points to pass`
							}
						</h3>
						<p className="text-gray-600 mb-4">Unlock our premium features to improve your score</p>

						<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 w-full mb-6">
							<div className="flex items-start gap-3">
								<TrendingUp className="text-amber-600 h-5 w-5 mt-0.5 flex-shrink-0" />
								<div className="text-left">
									<p className="font-medium text-amber-800">
										<span className="font-bold">80% of users</span> improve their scores by{" "}
										<span className="font-bold">2x</span> with our
									</p>
									<p className="font-bold text-amber-900">Weak Areas Focus Mode</p>
								</div>
							</div>
						</div>
					</div>

					<div className="mb-6">
						<div className="text-center mb-5">
							<h3 className="font-semibold mb-2">Choose Your Premium Plan</h3>
							<p className="text-sm text-gray-600">
								Select the plan that works best for you and start improving your score today
							</p>
						</div>

						<Features selectedPlan={selectedPlan} />
						<PlanSelection
							prices={prices}
							selectedPlan={selectedPlan}
							setSelectedPlan={setSelectedPlan}
						/>

						<div className="bg-[#0000cc]/5 rounded-lg p-3">
							<div className="flex items-center gap-2">
								<Clock className="text-[#0000cc] h-4 w-4 flex-shrink-0" />
								<p className="text-sm font-medium text-[#0000cc]">
									Offer expires in {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
								</p>
							</div>
						</div>
					</div>
				</CardContent>

				<CardFooter className="flex flex-col gap-2">
					<Button
						className="w-full py-6 transition-all bg-[#0000cc] hover:bg-[#0000ff]"
						onClick={onUnlockAllTests}
					>
						Get Started Today
					</Button>
					<div className="w-full text-center">
						<Button variant="ghost" className="text-gray-500 text-sm" onClick={onReturnHome}>
							No thanks, return to home
						</Button>
					</div>
					<p className="text-xs text-center text-gray-500 mt-2">Cancel anytime. Secure payment. No hidden fees.</p>
				</CardFooter>
			</Card>
		</div>
	)
}

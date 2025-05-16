"use client"

import { useState, useEffect } from "react"
import { Clock, TrendingUp, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

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
	const [isHovered, setIsHovered] = useState(false)
	const [selectedPlan, setSelectedPlan] = useState("weekly")

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
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-900 to-indigo-950 p-4">
			<Card className="w-full max-w-md overflow-hidden shadow-2xl border-0">
				<div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
					<div className="flex justify-between items-center">
						<Badge variant="outline" className="bg-white/10 text-white border-white/20 px-3 py-1">
							Test Results
						</Badge>
						<div className="flex items-center gap-1.5 text-amber-200 font-medium text-sm">
							<Clock className="h-4 w-4" />
							<span>
								{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
							</span>
						</div>
					</div>
					<h2 className="text-2xl font-bold mt-4 mb-1">
						{isPass ? "Congratulations! 🎉" : "Almost There!"}
					</h2>
					<p className="text-white/80 text-sm">
						{isPass ? "You've passed the test!" : "Your score needs improvement to pass"}
					</p>
				</div>

				<CardContent className="p-6 pt-8">
					<div className="flex flex-col items-center text-center mb-6">
						<div className="relative mb-4">
							<div className="absolute inset-0 flex items-center justify-center">
								<span className="text-2xl font-bold text-indigo-700">{score}/{totalQuestions}</span>
							</div>
							<svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
								<circle
									className="text-gray-200"
									strokeWidth="8"
									stroke="currentColor"
									fill="transparent"
									r="40"
									cx="50"
									cy="50"
								/>
								<circle
									className="text-amber-500"
									strokeWidth="8"
									strokeDasharray={251.2}
									strokeDashoffset={251.2 - (251.2 * score) / totalQuestions}
									strokeLinecap="round"
									stroke="currentColor"
									fill="transparent"
									r="40"
									cx="50"
									cy="50"
								/>
							</svg>
						</div>

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

						{/* Plan selection */}
						<div className="grid grid-cols-3 gap-2 mb-4">
							<div
								className={`rounded-lg p-3 cursor-pointer transition-colors text-center ${
									selectedPlan === "weekly"
										? "bg-indigo-100 border-2 border-indigo-500"
										: "border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
								}`}
								onClick={() => setSelectedPlan("weekly")}
							>
								<div className="font-medium text-sm mb-1">Weekly</div>
								<div className="text-xs text-gray-500 line-through">$7.99</div>
								<div className="text-lg font-bold text-indigo-700">$3.99</div>
							</div>

							<div
								className={`rounded-lg p-3 cursor-pointer transition-colors text-center relative ${
									selectedPlan === "monthly"
										? "bg-indigo-100 border-2 border-indigo-500"
										: "border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
								}`}
								onClick={() => setSelectedPlan("monthly")}
							>
								<div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
									BEST VALUE
								</div>
								<div className="font-medium text-sm mb-1 mt-1">Monthly</div>
								<div className="text-xs text-gray-500 line-through">$19.99</div>
								<div className="text-lg font-bold text-indigo-700">$9.99</div>
							</div>

							<div
								className={`rounded-lg p-3 cursor-pointer transition-colors text-center ${
									selectedPlan === "annual"
										? "bg-indigo-100 border-2 border-indigo-500"
										: "border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"
								}`}
								onClick={() => setSelectedPlan("annual")}
							>
								<div className="font-medium text-sm mb-1">Annual</div>
								<div className="text-xs text-gray-500 line-through">$119.99</div>
								<div className="text-lg font-bold text-indigo-700">$59.99</div>
							</div>
						</div>

						{/* Features based on selected plan */}
						<div className="border rounded-lg p-4 bg-white">
							<h4 className="font-medium mb-3">
								{selectedPlan === "weekly" && "Basic Access"}
								{selectedPlan === "monthly" && "Complete Access"}
								{selectedPlan === "annual" && "Premium Access"}
							</h4>

							{selectedPlan === "weekly" && (
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<CheckCircle className="text-green-500 h-4 w-4 flex-shrink-0" />
										<span className="text-gray-700 text-sm">Unlimited practice tests</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle className="text-green-500 h-4 w-4 flex-shrink-0" />
										<span className="text-gray-700 text-sm">Basic performance tracking</span>
									</div>
									<div className="flex items-center gap-2 text-gray-400">
										<CheckCircle className="h-4 w-4 flex-shrink-0" />
										<span className="text-sm">Personalized study plan</span>
									</div>
									<div className="flex items-center gap-2 text-gray-400">
										<CheckCircle className="h-4 w-4 flex-shrink-0" />
										<span className="text-sm">Weak Areas Focus Mode</span>
									</div>
								</div>
							)}

							{selectedPlan === "monthly" && (
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<CheckCircle className="text-green-500 h-4 w-4 flex-shrink-0" />
										<span className="text-gray-700 text-sm">Unlimited practice tests</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle className="text-green-500 h-4 w-4 flex-shrink-0" />
										<span className="text-gray-700 text-sm">Advanced performance tracking</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle className="text-green-500 h-4 w-4 flex-shrink-0" />
										<span className="text-gray-700 text-sm">Personalized study plan</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle className="text-green-500 h-4 w-4 flex-shrink-0" />
										<span className="text-gray-700 text-sm">Weak Areas Focus Mode</span>
									</div>
									<div className="flex items-center gap-2 text-gray-400">
										<CheckCircle className="h-4 w-4 flex-shrink-0" />
										<span className="text-sm">1-on-1 coaching session</span>
									</div>
								</div>
							)}

							{selectedPlan === "annual" && (
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<CheckCircle className="text-green-500 h-4 w-4 flex-shrink-0" />
										<span className="text-gray-700 text-sm">Unlimited practice tests</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle className="text-green-500 h-4 w-4 flex-shrink-0" />
										<span className="text-gray-700 text-sm">Advanced performance tracking</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle className="text-green-500 h-4 w-4 flex-shrink-0" />
										<span className="text-gray-700 text-sm">Personalized study plan</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle className="text-green-500 h-4 w-4 flex-shrink-0" />
										<span className="text-gray-700 text-sm">Weak Areas Focus Mode</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle className="text-green-500 h-4 w-4 flex-shrink-0" />
										<span className="text-gray-700 text-sm">1-on-1 coaching session</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle className="text-green-500 h-4 w-4 flex-shrink-0" />
										<span className="text-gray-700 text-sm">Offline access to all materials</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle className="text-green-500 h-4 w-4 flex-shrink-0" />
										<span className="text-gray-700 text-sm">Priority support</span>
									</div>
								</div>
							)}

							<div className="mt-4 pt-3 border-t border-gray-100">
								<div className="flex items-center gap-2 text-indigo-700">
									<div className="text-xs font-medium">
										{selectedPlan === "weekly" && "Billed weekly"}
										{selectedPlan === "monthly" && "Billed monthly - Save 50%"}
										{selectedPlan === "annual" && "Billed annually - Save 60%"}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-indigo-50 rounded-lg p-3 mb-2">
						<div className="flex items-center gap-2">
							<Clock className="text-indigo-600 h-4 w-4 flex-shrink-0" />
							<p className="text-sm font-medium text-indigo-800">
								Offer expires in {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
							</p>
						</div>
					</div>
				</CardContent>

				<CardFooter className="flex flex-col gap-3 p-6 pt-0">
					<Button
						className={`w-full py-6 text-base font-bold transition-all ${
							isHovered ? "bg-green-600" : "bg-indigo-600 hover:bg-indigo-700"
						}`}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
						onClick={onUnlockAllTests}
					>
						{isHovered ? (
							<span className="flex items-center gap-1">
								Unlock Premium Now <ArrowRight className="h-4 w-4 ml-1" />
							</span>
						) : (
							"Get Started Today"
						)}
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

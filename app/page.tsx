"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { questions } from "@/data/questions";
import { DemoQuestion } from "@/components/landing/DemoQuestion";
import { DemoProgress } from "@/components/landing/DemoProgress";
import { DemoComplete } from "@/components/landing/DemoComplete";
import { PricingDialog } from "@/components/PricingDialog";
import { Footer } from "@/components/Footer";
import { BirthdayDialog } from "@/components/BirthdayDialog";
import {
	Loader2,
	Lock,
	ArrowRight,
	Trophy,
	User,
	Calendar,
	Clock,
	ChevronRight,
	FileText,
} from "lucide-react";

// Custom hook to detect mobile screens
const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		// Initial check
		checkIsMobile();

		// Add event listener
		window.addEventListener("resize", checkIsMobile);

		// Cleanup
		return () => window.removeEventListener("resize", checkIsMobile);
	}, []);

	return isMobile;
};

export default function Home() {
	const isMobile = useIsMobile();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
	const [demoScore, setDemoScore] = useState(0);
	const [questionsAnswered, setQuestionsAnswered] = useState(0);
	const [streak, setStreak] = useState(0);
	const [isDemoComplete, setIsDemoComplete] = useState(false);
	const [isPricingOpen, setIsPricingOpen] = useState(false);
	const [isBirthdayDialogOpen, setIsBirthdayDialogOpen] = useState(false);

	const { user, isLoaded } = useUser();
	const router = useRouter();
	const { isLoading, hasActiveSubscription } = useAuthContext();

	const currentQuestion = questions[currentQuestionIndex];

	const checkAnswer = useCallback(() => {
		if (selectedOption !== null && !isAnswerRevealed) {
			setIsAnswerRevealed(true);
			setQuestionsAnswered((prev) => prev + 1);

			if (selectedOption === currentQuestion.correctAnswer) {
				setDemoScore((prev) => prev + 1);
				setStreak((prev) => prev + 1);
			} else {
				setStreak(0);
			}
		}
	}, [selectedOption, isAnswerRevealed, currentQuestion.correctAnswer]);

	const goToNextQuestion = useCallback(() => {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
			setSelectedOption(null);
			setIsAnswerRevealed(false);
		} else {
			setIsDemoComplete(true);
		}
	}, [currentQuestionIndex]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			// Number keys 1-4 for selecting options (0-3 in array)
			if (e.key >= "1" && e.key <= "4" && !isAnswerRevealed) {
				const optionIndex = Number.parseInt(e.key) - 1;
				if (optionIndex >= 0 && optionIndex < currentQuestion.options.length) {
					setSelectedOption(optionIndex);
				}
			}

			// Space to check answer or continue
			if (e.key === " ") {
				e.preventDefault();
				if (!isAnswerRevealed && selectedOption !== null) {
					checkAnswer();
				} else if (isAnswerRevealed) {
					goToNextQuestion();
				}
			}
		},
		[
			currentQuestion,
			selectedOption,
			isAnswerRevealed,
			checkAnswer,
			goToNextQuestion,
		],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	const selectOption = (index: number) => {
		if (!isAnswerRevealed) {
			setSelectedOption(index);
		}
	};

	const resetDemo = () => {
		setCurrentQuestionIndex(0);
		setSelectedOption(null);
		setIsAnswerRevealed(false);
		setDemoScore(0);
		setQuestionsAnswered(0);
		setStreak(0);
		setIsDemoComplete(false);
	};

	const handleStudyClick = () => {
		window.open(
			"https://www.dmv.ca.gov/portal/file/california-driver-handbook-pdf/",
			"_blank",
		);
	};

	const handlePracticeClick = () => {
		console.log(
			"Practice Test clicked. Subscription status:",
			hasActiveSubscription,
		);
		if (!hasActiveSubscription) {
			console.log("Opening pricing dialog...");
			setIsPricingOpen(true);
			return;
		}
		router.push("/practice");
	};

	// Add handlePlanSelect function
	const handlePlanSelect = async (plan: "weekly" | "monthly" | "lifetime") => {
		try {
			const response = await fetch("/api/create-checkout-session", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					plan,
				}),
			});

			const data = await response.json();

			if (data.url) {
				window.location.href = data.url;
			}
		} catch (error) {
			console.error("Error creating checkout session:", error);
		}
	};

	// Check if user has birthday set
	useEffect(() => {
		const checkUserBirthday = async () => {
			if (!user || !hasActiveSubscription) return;

			try {
				const response = await fetch("/api/user/birthday");
				const data = await response.json();

				if (!data.hasBirthday) {
					setIsBirthdayDialogOpen(true);
				}
			} catch (error) {
				console.error("Error checking user birthday:", error);
			}
		};

		checkUserBirthday();
	}, [user, hasActiveSubscription]);

	// Handle saving birthday
	const handleSaveBirthday = async (birthday: Date) => {
		try {
			const response = await fetch("/api/user/birthday", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ birthday }),
			});

			if (response.ok) {
				setIsBirthdayDialogOpen(false);
			}
		} catch (error) {
			console.error("Error saving birthday:", error);
		}
	};

	if (!isLoaded || isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	const progressPercentage = (questionsAnswered / questions.length) * 100;

	// Add PricingDialog component that will be used across all views
	const pricingDialog = (
		<PricingDialog
			isOpen={isPricingOpen}
			onClose={() => setIsPricingOpen(false)}
			onPlanSelect={(plan) => {
				handlePlanSelect(plan);
				setIsPricingOpen(false);
			}}
		/>
	);

	// Render dashboard if user is authenticated
	if (user) {
		return (
			<>
				<div className="container mx-auto p-4">
					{/* User profile card */}
					<div className="rounded-lg p-4 mb-6 border border-slate-200 dark:border-slate-800">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
									<User className="h-5 w-5 text-slate-500" />
								</div>
								<div>
									<h3 className="font-medium">
										{user.firstName || user.fullName?.split(" ")[0] || "Alvaro"}
									</h3>
									<p className="text-sm text-muted-foreground">
										Premium Member
									</p>
								</div>
							</div>
							<div className="flex gap-6">
								<div className="text-right">
									<p className="text-sm text-muted-foreground">Study streak</p>
									<p className="font-semibold">3 days</p>
								</div>
								<div className="text-right">
									<p className="text-sm text-muted-foreground">Time studied</p>
									<p className="font-semibold">4h 23m</p>
								</div>
							</div>
						</div>
					</div>

					{/* Top welcome section */}
					<div className="rounded-lg p-6 mb-6 border border-slate-200 dark:border-slate-800">
						<h2 className="text-2xl font-bold mb-1">
							Welcome back,{" "}
							{user.firstName || user.fullName?.split(" ")[0] || "Alvaro"}!
						</h2>
						<p className="text-muted-foreground mb-4">
							Ready to continue your DMV test preparation? You&apos;re making
							great progress!
						</p>

						<div className="mb-4">
							<div className="flex justify-between mb-1">
								<span className="font-medium">Overall progress</span>
								<span className="font-medium">42%</span>
							</div>
							<div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
								<div
									className="bg-primary h-2.5 rounded-full"
									style={{ width: "42%" }}
								/>
							</div>
						</div>

						<div className="flex gap-4 mt-4">
							<Button
								onClick={handlePracticeClick}
								className="flex items-center gap-2"
							>
								{!hasActiveSubscription ? (
									<Lock className="h-4 w-4" />
								) : (
									<ArrowRight className="h-4 w-4" />
								)}
								Continue Practice Test
							</Button>
							<Button
								onClick={handleStudyClick}
								variant="outline"
								className="flex items-center gap-2"
							>
								<FileText className="h-4 w-4" />
								DMV Handbook
							</Button>
						</div>
					</div>

					{/* Stats cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
						{/* Tests completed card */}
						<div className="rounded-lg p-6 border border-slate-200 dark:border-slate-800">
							<div className="flex items-center gap-3 mb-2">
								<h3 className="text-lg font-medium">Tests Completed</h3>
							</div>
							<div className="mt-2">
								<div className="flex items-center gap-1">
									<Trophy className="h-8 w-8 text-yellow-500" />
									<span className="text-4xl font-bold">3</span>
								</div>
								<div className="mt-1 text-sm">
									<span className="text-green-500">+2</span> from last week
								</div>
							</div>
						</div>

						{/* Average score card */}
						<div className="rounded-lg p-6 border border-slate-200 dark:border-slate-800">
							<h3 className="text-lg font-medium mb-2">Average Score</h3>
							<div className="mt-2">
								<span className="text-4xl font-bold">78%</span>
								<div className="mt-1 text-sm">
									<span className="text-green-500">+5%</span> from last test
								</div>
							</div>
						</div>

						{/* Last score card */}
						<div className="rounded-lg p-6 border border-slate-200 dark:border-slate-800">
							<h3 className="text-lg font-medium mb-2">Last Score</h3>
							<div className="mt-2">
								<span className="text-4xl font-bold">82%</span>
								<div className="mt-1">
									<span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
										Passing
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Recent Sessions Section */}
					<div className="mb-6">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold">Recent Sessions</h2>
							<a
								href="/sessions"
								className="text-primary flex items-center gap-1 text-sm font-medium"
							>
								View all <ChevronRight className="h-4 w-4" />
							</a>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Recent Sessions column */}
							<div>
								{/* In Progress Session Card */}
								<div className="border border-slate-200 dark:border-slate-800 rounded-lg p-6 mb-4">
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center gap-3">
											<span className="text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
												In Progress
											</span>
											<h3 className="font-semibold text-lg">
												Road Signs Practice Test
											</h3>
										</div>
										<Button>Continue</Button>
									</div>

									<div className="mb-4">
										<div className="flex items-center gap-2 text-muted-foreground">
											<Calendar className="h-4 w-4" />
											<span className="text-sm">4/3/2025 at 07:39 PM</span>
										</div>
										<div className="flex items-center gap-2 text-muted-foreground mt-2">
											<Clock className="h-4 w-4" />
											<span className="text-sm">Time spent: 12 minutes</span>
										</div>
									</div>

									<div className="flex justify-between items-center">
										<span className="text-sm">
											Progress: 0% (0 completed, 12 left)
										</span>
										<span className="text-sm font-medium">Ready to start</span>
									</div>
									<div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mt-2">
										<div
											className="bg-blue-600 h-2 rounded-full"
											style={{ width: "0%" }}
										/>
									</div>
								</div>

								{/* Completed Session Card */}
								<div className="border border-slate-200 dark:border-slate-800 rounded-lg p-6">
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center gap-3">
											<span className="text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-full text-xs font-medium">
												Completed
											</span>
											<h3 className="font-semibold text-lg">
												Traffic Laws Test
											</h3>
										</div>
										<Button variant="outline">Review</Button>
									</div>

									<div className="mb-4">
										<div className="flex items-center gap-2 text-muted-foreground">
											<Calendar className="h-4 w-4" />
											<span className="text-sm">4/2/2025 at 06:15 PM</span>
										</div>
										<div className="flex items-center gap-2 text-muted-foreground mt-2">
											<Clock className="h-4 w-4" />
											<span className="text-sm">Time spent: 24 minutes</span>
										</div>
									</div>

									<div className="flex justify-between items-center">
										<span className="text-sm">Score: 82% (41/50 correct)</span>
										<span className="text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded-full text-xs font-medium">
											Passing
										</span>
									</div>
									<div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mt-2">
										<div
											className="bg-blue-600 h-2 rounded-full"
											style={{ width: "82%" }}
										/>
									</div>
								</div>
							</div>

							{/* Analytics column */}
							<div className="border border-slate-200 dark:border-slate-800 rounded-lg p-6">
								<h3 className="text-xl font-semibold mb-4">Analytics</h3>
								<p className="text-muted-foreground">
									Your test performance analytics will appear here as you
									complete more tests.
								</p>
							</div>
						</div>
					</div>

					{/* Study Tips Section */}
					<div className="border border-slate-200 dark:border-slate-800 rounded-lg p-6 mb-6">
						<h2 className="text-xl font-semibold mb-4">Study Tips</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="flex gap-4 items-start">
								<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-blue-600 dark:text-blue-300"
									>
										<title>Graduation cap icon</title>
										<path d="M22 10v6M2 10l10-5 10 5-10 5z" />
										<path d="M6 12v5c3 3 9 3 12 0v-5" />
									</svg>
								</div>
								<div>
									<h3 className="font-medium text-lg">
										Take practice tests regularly
									</h3>
									<p className="text-muted-foreground">
										Regular testing helps reinforce knowledge and identify weak
										areas.
									</p>
								</div>
							</div>

							<div className="flex gap-4 items-start">
								<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-blue-600 dark:text-blue-300"
									>
										<title>Clock icon</title>
										<circle cx="12" cy="12" r="10" />
										<polyline points="12 6 12 12 16 14" />
									</svg>
								</div>
								<div>
									<h3 className="font-medium text-lg">
										Study in short sessions
									</h3>
									<p className="text-muted-foreground">
										Multiple 20-30 minute sessions are more effective than
										cramming.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{pricingDialog}
				<BirthdayDialog
					isOpen={isBirthdayDialogOpen}
					onSave={handleSaveBirthday}
				/>
			</>
		);
	}

	// If not authenticated, render the landing page demo
	if (isDemoComplete) {
		return (
			<>
				<DemoComplete
					score={demoScore}
					totalQuestions={questions.length}
					progressPercentage={progressPercentage}
					onReset={resetDemo}
				/>
				{pricingDialog}
				<Footer />
			</>
		);
	}

	return (
		<div className="w-full">
			<div className="container mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-5xl md:text-7xl font-bold mb-6">
						Ace Your DMV Knowledge Test
					</h1>
					<h2 className="text-xl md:text-3xl text-muted-foreground max-w-xl mx-auto px-4">
						Practice with real questions, track your progress, and ace your test
						💯
					</h2>
				</div>

				<DemoProgress
					currentQuestionIndex={currentQuestionIndex}
					totalQuestions={questions.length}
					score={demoScore}
					streak={streak}
					progressPercentage={progressPercentage}
				/>

				<DemoQuestion
					question={currentQuestion.question}
					options={currentQuestion.options}
					selectedOption={selectedOption}
					isAnswerRevealed={isAnswerRevealed}
					correctAnswer={currentQuestion.correctAnswer}
					onOptionSelect={selectOption}
				/>

				<div className="flex justify-between">
					{!isAnswerRevealed ? (
						<Button
							onClick={checkAnswer}
							disabled={selectedOption === null}
							className="w-full"
						>
							Check Answer{!isMobile && " (Space)"}
						</Button>
					) : (
						<Button onClick={goToNextQuestion} className="w-full">
							Next Question{!isMobile && " (Space)"}
						</Button>
					)}
				</div>

				{!isMobile && (
					<div className="mt-6 text-center text-sm text-muted-foreground">
						<p>
							Keyboard shortcuts: Press 1-4 to select an option, Space to
							check/continue
						</p>
					</div>
				)}
			</div>
			{pricingDialog}
			<Footer />
		</div>
	);
}

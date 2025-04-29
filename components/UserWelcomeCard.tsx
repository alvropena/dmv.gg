"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
	Lock,
	Play,
	PlayCircle,
	PlusCircle,
	FileText,
	Loader2,
	RotateCcw,
} from "lucide-react";
import { PricingDialog } from "@/components/PricingDialog";

type Test = {
	id: string;
	totalQuestions: number;
	completedQuestions: number;
	correctAnswers: number;
	status: string;
	answers: Array<{
		id: string;
		isCorrect: boolean | null;
	}>;
};

export function UserWelcomeCard() {
	const router = useRouter();
	const { dbUser, hasActiveSubscription } = useAuthContext();
	const [progress, setProgress] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [hasExistingTests, setHasExistingTests] = useState(false);
	const [latestTestId, setLatestTestId] = useState<string | null>(null);
	const [isCreatingTest, setIsCreatingTest] = useState(false);
	const [completedQuestions, setCompletedQuestions] = useState(0);
	const [remainingQuestions, setRemainingQuestions] = useState(0);
	const [isPricingOpen, setIsPricingOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isTestCompleted, setIsTestCompleted] = useState(false);

	const displayName = dbUser?.firstName || "User";
	const hasAccess = hasActiveSubscription || dbUser?.role === "ADMIN";
	const hasUsedFreeTest = dbUser?.hasUsedFreeTest || false;

	useEffect(() => {
		const fetchUserProgress = async () => {
			try {
				setIsLoading(true);
				const response = await fetch("/api/tests");

				if (!response.ok) {
					throw new Error("Failed to fetch tests");
				}

				const data = await response.json();

				// Get the most recent test
				if (data.tests && data.tests.length > 0) {
					setHasExistingTests(true);
					const latestTest = data.tests[0] as Test;
					setLatestTestId(latestTest.id);
					setIsTestCompleted(latestTest.status === "completed");

					// Calculate progress based on answered questions
					if (latestTest.totalQuestions > 0) {
						// Count how many questions have been answered (where isCorrect is not null)
						const answeredCount = latestTest.answers.filter(
							(answer) => answer.isCorrect !== null,
						).length;
						const correctCount = latestTest.answers.filter(
							(answer) => answer.isCorrect === true,
						).length;

						setCompletedQuestions(answeredCount);
						setRemainingQuestions(latestTest.totalQuestions - answeredCount);

						// If test is completed, show percentage of correct answers
						if (latestTest.status === "completed") {
							const progressPercentage = Math.round(
								(correctCount / latestTest.totalQuestions) * 100,
							);
							setProgress(progressPercentage);
						}
						// If test is in progress, show percentage of answered questions
						else {
							const progressPercentage = Math.round(
								(answeredCount / latestTest.totalQuestions) * 100,
							);
							setProgress(progressPercentage);
						}
					} else {
						setProgress(0);
						setCompletedQuestions(0);
						setRemainingQuestions(0);
					}
				} else {
					// No tests found
					setHasExistingTests(false);
					setProgress(0);
					setCompletedQuestions(0);
					setRemainingQuestions(0);
				}
			} catch (error) {
				console.error("Error fetching tests:", error);
				setHasExistingTests(false);
				setProgress(0);
				setCompletedQuestions(0);
				setRemainingQuestions(0);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserProgress();
	}, []);

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

	const handleStartNewTest = async () => {
		if (hasAccess || !hasUsedFreeTest) {
			try {
				setIsCreatingTest(true);
				setError(null);
				const response = await fetch("/api/tests", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					const data = await response.json();
					if (response.status === 403) {
						setIsPricingOpen(true);
						return;
					}
					throw new Error(data.error || "Failed to create test");
				}

				const data = await response.json();
				if (data?.test?.id) {
					router.push(`/test/${data.test.id}`);
				} else {
					throw new Error("No test ID received from server");
				}
			} catch (error) {
				console.error("Error creating new test:", error);
				setError(
					error instanceof Error ? error.message : "Failed to create test",
				);
			} finally {
				setIsCreatingTest(false);
			}
		} else {
			setIsPricingOpen(true);
		}
	};

	const handleContinueTest = () => {
		if (!hasAccess && hasUsedFreeTest) {
			setIsPricingOpen(true);
			return;
		}
		if (latestTestId) {
			router.push(`/test/${latestTestId}`);
		}
	};

	return (
		<div className="container mx-auto px-4 sm:px-6 mb-6">
			<div className="rounded-xl p-6 border border-slate-200 bg-white">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<h1 className="text-2xl font-semibold">
							Welcome back, {displayName}!
						</h1>
						{!hasAccess && !hasUsedFreeTest && (
							<p className="text-muted-foreground">
								Start with your free practice test. Subscribe to unlock
								unlimited tests.
							</p>
						)}
						{!hasAccess && hasUsedFreeTest && (
							<p className="text-muted-foreground">
								You&apos;ve used your free test. Subscribe to continue
								practicing.
							</p>
						)}
						{hasAccess && (
							<p className="text-muted-foreground">
								Continue your practice or start a new test.
							</p>
						)}
					</div>

					{hasExistingTests && !isLoading && (
						<div className="flex flex-col gap-2">
							<div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
								<div
									className="h-full bg-blue-600 transition-all duration-500 rounded-full"
									style={{ width: `${progress}%` }}
								/>
							</div>
							<div className="flex justify-between text-sm text-muted-foreground">
								<span>{completedQuestions} completed</span>
								<span>{remainingQuestions} remaining</span>
							</div>
						</div>
					)}

					{error && <div className="text-red-500 text-sm">{error}</div>}

					<div className="flex flex-col sm:flex-row gap-3">
						{hasExistingTests ? (
							<>
								{isTestCompleted ? (
									<>
										<Button
											onClick={handleStartNewTest}
											className="flex items-center justify-center gap-2 rounded-[40px] min-w-[140px]"
											disabled={
												isCreatingTest || (!hasAccess && hasUsedFreeTest)
											}
										>
											{!hasAccess && hasUsedFreeTest ? (
												<Lock className="h-4 w-4" />
											) : isCreatingTest ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												<PlusCircle className="h-4 w-4" />
											)}
											{!isCreatingTest && "Start New Test"}
										</Button>
										<Button
											variant="secondary"
											onClick={() =>
												latestTestId &&
												router.push(`/test/${latestTestId}?review=true`)
											}
											className="flex items-center justify-center gap-2 rounded-[40px] min-w-[140px]"
											disabled={!hasAccess && hasUsedFreeTest}
										>
											{!hasAccess && hasUsedFreeTest ? (
												<Lock className="h-4 w-4" />
											) : (
												<RotateCcw className="h-4 w-4" />
											)}
											Retake Test
										</Button>
									</>
								) : (
									<>
										<Button
											onClick={handleContinueTest}
											className="flex items-center justify-center gap-2 rounded-[40px] min-w-[140px]"
											disabled={!hasAccess && hasUsedFreeTest}
										>
											{!hasAccess && hasUsedFreeTest ? (
												<Lock className="h-4 w-4" />
											) : (
												<PlayCircle className="h-4 w-4" />
											)}
											Continue Test
										</Button>
										<Button
											variant="secondary"
											onClick={handleStartNewTest}
											className="flex items-center justify-center gap-2 rounded-[40px] min-w-[140px]"
											disabled={
												isCreatingTest || (!hasAccess && hasUsedFreeTest)
											}
										>
											{!hasAccess && hasUsedFreeTest ? (
												<Lock className="h-4 w-4" />
											) : isCreatingTest ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												<PlusCircle className="h-4 w-4" />
											)}
											{!isCreatingTest && "Start New Test"}
										</Button>
									</>
								)}
								<Button
									onClick={() =>
										window.open(
											"https://www.dmv.ca.gov/portal/file/california-driver-handbook-pdf/",
											"_blank",
										)
									}
									variant="outline"
									className="flex items-center justify-center gap-2 rounded-[40px]"
								>
									<FileText className="h-4 w-4" />
									DMV Handbook
								</Button>
							</>
						) : (
							<Button
								onClick={handleStartNewTest}
								className="flex items-center justify-center gap-2 rounded-[40px] min-w-[120px]"
								disabled={isCreatingTest || (!hasAccess && hasUsedFreeTest)}
							>
								{!hasAccess && hasUsedFreeTest ? (
									<Lock className="h-4 w-4" />
								) : isCreatingTest ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Play className="h-4 w-4" />
								)}
								{!isCreatingTest && "Start Test"}
							</Button>
						)}
					</div>
				</div>

				<PricingDialog
					isOpen={isPricingOpen}
					onClose={() => setIsPricingOpen(false)}
					onPlanSelect={handlePlanSelect}
				/>
			</div>
		</div>
	);
}

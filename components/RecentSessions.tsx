import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Test, TestAnswer } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { PricingDialog } from "@/components/dialogs/PricingDialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePostHog } from 'posthog-js/react';

type TestWithAnswers = Test & {
	answers: TestAnswer[];
};

type RecentSessionsProps = {
	isLoading?: boolean;
};

export function RecentSessions({
	isLoading: initialLoading = false,
}: RecentSessionsProps) {
	const router = useRouter();
	const { dbUser, isLoading: isUserLoading, hasActiveSubscription } = useAuthContext();
	const [tests, setTests] = useState<TestWithAnswers[]>([]);
	const [isLoading, setIsLoading] = useState(initialLoading);
	const [error, setError] = useState<string | null>(null);
	const [isPricingOpen, setIsPricingOpen] = useState(false);
	const posthog = usePostHog();

	const hasAccess = hasActiveSubscription || dbUser?.role === "ADMIN";

	useEffect(() => {
		const fetchTests = async () => {
			// Don't fetch if user is not initialized yet
			if (isUserLoading || !dbUser) return;

			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch("/api/tests");

				if (!response.ok) {
					throw new Error("Failed to fetch tests");
				}

				const data = await response.json();
				setTests(data.tests || []);
			} catch (err) {
				console.error("Error fetching tests:", err);
				setError("Failed to load tests. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchTests();
	}, [dbUser, isUserLoading]);

	// Helper function to format date
	const formatDate = (dateString: Date | null) => {
		if (!dateString) return "";

		const date = new Date(dateString);
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
		const diffInMinutes = Math.floor(diffInSeconds / 60);
		const diffInHours = Math.floor(diffInMinutes / 60);
		const diffInDays = Math.floor(diffInHours / 24);

		// For very recent times
		if (diffInMinutes < 1) return "Just now";
		if (diffInMinutes < 60) {
			return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
		}

		// For today
		if (diffInHours < 24) {
			return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
		}

		// For yesterday
		if (diffInDays === 1) {
			return `Yesterday at ${date.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			})}`;
		}

		// For this week (less than 7 days)
		if (diffInDays < 7) {
			return `${date.toLocaleDateString("en-US", { weekday: "long" })} at ${date.toLocaleTimeString(
				"en-US",
				{
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
				},
			)}`;
		}

		// For older dates
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	// Calculate progress for in-progress tests
	const getAnsweredCount = (test: TestWithAnswers) => {
		return test.answers.filter((a) => a.selectedAnswer !== null).length;
	};

	// Get the latest 3 tests for display
	const recentTests = tests.slice(0, 3);

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
			console.error("Error:", error);
		}
	};

	// Navigate to test page
	const handleTestNavigation = async (testId: string, isCompleted: boolean) => {
		if (isCompleted && !hasAccess) {
			setIsPricingOpen(true);
			return;
		}
		if (isCompleted) {
			// For completed tests, create a new REVIEW test
			try {
				const response = await fetch("/api/tests", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						type: "REVIEW",
						originalTestId: testId
					}),
				});

				if (!response.ok) {
					throw new Error("Failed to create review test");
				}

				const data = await response.json();
				if (data?.test?.id) {
					router.push(`/test/${data.test.id}`);
				}
			} catch (error) {
				console.error("Error creating review test:", error);
			}
		} else {
			// Continue the in-progress test
			router.push(`/test/${testId}`);
		}
	};

	useEffect(() => {
		if (isPricingOpen) {
			posthog?.capture('pricing_dialog_opened');
		}
	}, [isPricingOpen, posthog]);

	return (
		<div className="w-full px-2">
			<div className="container mx-auto">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Recent Sessions</h2>
					<Link
						href="/tests"
						className="text-primary flex items-center gap-1 text-sm font-medium"
					/>
				</div>

				{isLoading || isUserLoading ? (
					<div className="flex justify-center items-center p-12">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
					</div>
				) : error ? (
					<div className="text-red-500 p-4 border border-red-200 rounded-lg">
						{error}
					</div>
				) : (
					<div>
						{recentTests.length === 0 ? (
							<div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-white dark:bg-slate-950">
								<div className="flex flex-col items-center justify-center py-6 text-center">
									<Calendar className="h-10 w-10 text-muted-foreground mb-2" />
									<p className="text-muted-foreground mb-4">
										No tests found. Start a practice test to see your tests
										here.
									</p>
									<Button
										onClick={() => router.push("/test")}
										variant="outline"
										className="rounded-xl"
									>
										Take a Test
									</Button>
								</div>
							</div>
						) : (
							recentTests.map((test) => (
								<div
									key={test.id}
									className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-4 last:mb-0 bg-white dark:bg-slate-950"
								>
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center gap-3">
											{test.status === "completed" ? (
												<Badge className="text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full">
													Completed
												</Badge>
											) : (
												<Badge variant="secondary" className="rounded-full">
													In Progress
												</Badge>
											)}
											<h3 className="font-semibold text-lg">
												Practice Test #{tests.length - tests.indexOf(test)}
											</h3>
										</div>
										<Button
											variant={
												test.status === "completed" ? "secondary" : "default"
											}
											onClick={() =>
												handleTestNavigation(
													test.id,
													test.status === "completed",
												)
											}
											className="min-w-[100px] flex items-center justify-center gap-2"
										>
											{test.status === "completed" ? (
												<>
													{!hasAccess ? <Lock className="h-4 w-4" /> : null}
													Review
												</>
											) : (
												"Continue"
											)}
										</Button>
									</div>

									<div className="flex justify-between items-center mt-4 text-sm">
										{test.status === "completed" ? (
											<>
												<span className="text-sm">
													Score: {test.score}% (
													{Math.round((test.score / 100) * test.totalQuestions)}
													/{test.totalQuestions} correct)
												</span>
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger asChild>
															<Badge
																variant={
																	Math.round(
																		(test.score / 100) * test.totalQuestions,
																	) >= 39
																		? "secondary"
																		: "destructive"
																}
																className={`rounded-full ${
																	Math.round(
																		(test.score / 100) * test.totalQuestions,
																	) >= 39
																		? "bg-green-100 hover:bg-green-100 text-green-700 border-green-200 font-normal shadow-none"
																		: ""
																}`}
															>
																{Math.round(
																	(test.score / 100) * test.totalQuestions,
																) >= 39
																	? "Passing"
																	: "Failed"}
															</Badge>
														</TooltipTrigger>
														<TooltipContent>
															<p>
																{Math.round(
																	(test.score / 100) * test.totalQuestions,
																) >= 39
																	? `Passed with ${
																			test.totalQuestions -
																			Math.round(
																				(test.score / 100) *
																					test.totalQuestions,
																			)
																		} errors (max allowed: 5)`
																	: `Failed with ${
																			test.totalQuestions -
																			Math.round(
																				(test.score / 100) *
																					test.totalQuestions,
																			)
																		} errors. Max 5 errors allowed out of ${
																			test.totalQuestions
																		} questions.`}
															</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</>
										) : (
											<>
												<span className="text-muted-foreground flex items-center gap-2">
													<Calendar className="h-4 w-4" />
													{formatDate(test.startedAt)}
												</span>
												<span className="">
													{Math.round(
														(getAnsweredCount(test) / test.totalQuestions) *
															100,
													)}
													%
												</span>
											</>
										)}
									</div>
									<div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mt-2">
										<div
											className="bg-blue-600 h-2 rounded-full"
											style={{
												width:
													test.status === "completed"
														? `${test.score}%`
														: `${Math.round(
																(getAnsweredCount(test) / test.totalQuestions) *
																	100,
															)}%`,
											}}
										/>
									</div>
									{test.status !== "completed" && (
										<div className="flex justify-between text-sm text-muted-foreground mt-1">
											<span>{getAnsweredCount(test)} completed</span>
											<span>
												{test.totalQuestions - getAnsweredCount(test)} remaining
											</span>
										</div>
									)}
								</div>
							))
						)}
					</div>
				)}
			</div>

			<PricingDialog
				isOpen={isPricingOpen}
				onClose={() => setIsPricingOpen(false)}
				onPlanSelect={handlePlanSelect}
			/>
		</div>
	);
}

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lock, FileText, Play, PlayCircle, PlusCircle } from "lucide-react";
import type { UserResource } from "@clerk/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

type UserWelcomeCardProps = {
	user: UserResource;
	hasActiveSubscription: boolean;
	onStudyClick: () => void;
	onStartTestClick?: () => void;
};

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

export function UserWelcomeCard({
	user,
	hasActiveSubscription,
	onStudyClick,
	onStartTestClick,
}: UserWelcomeCardProps) {
	const router = useRouter();
	const { dbUser } = useAuthContext();
	const [progress, setProgress] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [hasExistingTests, setHasExistingTests] = useState(false);
	const [latestTestId, setLatestTestId] = useState<string | null>(null);
	const [isCreatingTest, setIsCreatingTest] = useState(false);
	const [completedQuestions, setCompletedQuestions] = useState(0);
	const [remainingQuestions, setRemainingQuestions] = useState(0);

	const displayName = user.firstName || user.fullName?.split(" ")[0] || "User";
	const hasAccess = hasActiveSubscription || dbUser?.role === "ADMIN";

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

	const handleContinueTest = () => {
		if (!hasAccess) {
			if (onStartTestClick) {
				onStartTestClick();
			}
			return;
		}
		if (latestTestId) {
			router.push(`/practice?test=${latestTestId}`);
		}
	};

	const handleStartNewTest = async () => {
		if (!hasAccess) {
			if (onStartTestClick) {
				onStartTestClick();
			}
			return;
		}

		try {
			setIsCreatingTest(true);
			const response = await fetch("/api/tests", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Failed to create test");
			}

			const data = await response.json();
			router.push(`/practice?test=${data.test.id}`);
		} catch (error) {
			console.error("Error creating new test:", error);
		} finally {
			setIsCreatingTest(false);
		}
	};

	return (
		<div className="rounded-lg p-4 mb-6 border border-slate-200 dark:border-slate-800">
			<div className="px-1">
				<h2 className="text-2xl font-bold mb-1">
					Welcome back, {displayName}!
					{dbUser?.role === "ADMIN" && (
						<span className="ml-2 text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
							Admin
						</span>
					)}
				</h2>
				<p className="text-muted-foreground mb-5 text-sm">
					Ready to continue your DMV test preparation? You&apos;re making
					{progress > 0 ? " great" : ""} progress!
				</p>

				<div className="mb-6">
					<div className="flex justify-between mb-2">
						<span className="text-sm">
							Progress:{" "}
							{isLoading ? (
								"Loading..."
							) : (
								<span className="font-bold">
									{completedQuestions} completed, {remainingQuestions} left
								</span>
							)}
						</span>
						<span className="font-bold text-sm">
							{isLoading ? "Loading..." : `${progress}%`}
						</span>
					</div>
					<Progress
						value={isLoading ? 5 : progress}
						className={`h-2.5 ${isLoading ? "animate-pulse" : ""}`}
					/>
				</div>

				<div className="flex flex-col sm:flex-row gap-3">
					{hasExistingTests ? (
						<>
							<Button
								onClick={handleContinueTest}
								className="flex items-center justify-center gap-2"
							>
								{!hasActiveSubscription ? (
									<Lock className="h-4 w-4" />
								) : (
									<PlayCircle className="h-4 w-4" />
								)}
								Continue Test
							</Button>
							<Button
								variant="secondary"
								onClick={handleStartNewTest}
								className="flex items-center justify-center gap-2"
								disabled={isCreatingTest}
							>
								{!hasActiveSubscription ? (
									<Lock className="h-4 w-4" />
								) : (
									<PlusCircle className="h-4 w-4" />
								)}
								{isCreatingTest ? "Creating..." : "Start New Test"}
							</Button>
						</>
					) : (
						<Button
							variant="secondary"
							onClick={handleStartNewTest}
							className="flex items-center justify-center gap-2"
							disabled={isCreatingTest}
						>
							{!hasActiveSubscription ? (
								<Lock className="h-4 w-4" />
							) : (
								<Play className="h-4 w-4" />
							)}
							{isCreatingTest ? "Creating..." : "Start Test"}
						</Button>
					)}
					<Button
						onClick={onStudyClick}
						variant="outline"
						className="flex items-center justify-center gap-2"
					>
						<FileText className="h-4 w-4" />
						DMV Handbook
					</Button>
				</div>
			</div>
		</div>
	);
}

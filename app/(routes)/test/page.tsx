"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAuthContext } from "@/contexts/AuthContext";
import type { Question } from "@/types";
import { QuestionCard } from "@/components/practice/QuestionCard";
import { ProgressBar } from "@/components/practice/ProgressBar";
import { CompletionCard } from "@/components/practice/CompletionCard";
import { PracticeHeader } from "@/components/practice/PracticeHeader";
import { useTimer } from "@/hooks/useTimer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Loader2 } from "lucide-react";

interface TestAnswer {
	selectedAnswer: string | null;
	questionId: string;
}

export default function PracticeTestPage() {
	const { user, isLoaded } = useUser();
	const router = useRouter();
	const { hasActiveSubscription, isLoading, dbUser } = useAuthContext();
	const isMobile = useIsMobile();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
	const [questionsAnswered, setQuestionsAnswered] = useState(0);
	const [questions, setQuestions] = useState<Question[]>([]);
	const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
	const [showCongratulations, setShowCongratulations] = useState(false);
	const [testId, setTestId] = useState<string | null>(null);
	const [isCreatingTest, setIsCreatingTest] = useState(true);
	const [startTime, setStartTime] = useState<Date>(new Date());
	const mountedRef = useRef(false);

	// Add hasAccess check
	const hasAccess = hasActiveSubscription || dbUser?.role === "ADMIN";

	// Use the custom timer hook
	const elapsedTime = useTimer(startTime);

	// Function to fetch test data and update local state
	const fetchTestData = useCallback(async () => {
		if (!testId || !hasAccess || !user) return;

		try {
			const response = await fetch(`/api/tests/testId?testId=${testId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch test");
			}

			const { test, questions } = await response.json();

			// Validate test data
			if (!test || !questions || !Array.isArray(questions)) {
				throw new Error("Invalid test data received");
			}

			// Set the questions for the test
			setQuestions(questions);

			// If this is a test being restored, set the start time
			if (test.startedAt) {
				setStartTime(new Date(test.startedAt));
			}

			// If test is completed, show congratulations
			if (test.status === "completed") {
				setShowCongratulations(true);
			}

			// Restore the user's progress in the test
			if (test.answers && Array.isArray(test.answers)) {
				// Count how many questions have been answered
				const answeredCount = test.answers.filter(
					(answer: TestAnswer) => answer.selectedAnswer !== null,
				).length;
				setQuestionsAnswered(answeredCount);

				// Find the last unanswered question to set the currentQuestionIndex
				if (answeredCount < test.totalQuestions) {
					const nextUnansweredIndex = test.answers.findIndex(
						(answer: TestAnswer) => answer.selectedAnswer === null,
					);
					if (nextUnansweredIndex !== -1) {
						setCurrentQuestionIndex(nextUnansweredIndex);
					}
				}
			}

			return test;
		} catch (error) {
			console.error("Error fetching test data:", error);
			// On error, redirect back to home
			router.push("/");
			return null;
		}
	}, [testId, hasAccess, user, router]);

	// Periodically update the test duration in the database
	useEffect(() => {
		// Don't update if the test is not started or is already completed
		if (!testId || showCongratulations) return;

		// Update duration every 30 seconds
		const updateInterval = 30 * 1000; // 30 seconds

		const updateDuration = async () => {
			try {
				const now = new Date();
				const durationMs = now.getTime() - startTime.getTime();
				const durationSecs = Math.floor(durationMs / 1000);

				await fetch(`/api/tests/testId?testId=${testId}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						status: "in_progress",
						durationSeconds: durationSecs,
					}),
				});
			} catch (error) {
				console.error("Error updating test duration:", error);
			}
		};

		// Initial update
		updateDuration();

		// Set up periodic updates
		const intervalId = setInterval(updateDuration, updateInterval);

		return () => {
			clearInterval(intervalId);
			// Final update when component unmounts
			updateDuration();
		};
	}, [testId, startTime, showCongratulations]);

	// Create a new test - only once on mount
	useEffect(() => {
		// Skip if already mounted or if we don't have user data
		if (mountedRef.current || !hasAccess || !user) return;

		// Mark as mounted to prevent duplicate calls
		mountedRef.current = true;

		const createTest = async () => {
			try {
				// Check if there's already a test ID in the URL
				const pathname = window.location.pathname;
				const match = pathname.match(/\/test=([^&]+)(?:&review=true)?/);
				const urlTestId = match ? match[1] : null;
				const isReview = pathname.includes("&review=true");

				// If URL already has a test ID, use that instead of creating a new one
				if (urlTestId) {
					setTestId(urlTestId);
					setIsCreatingTest(false);

					// If this is a review, show the congratulations screen
					if (isReview) {
						setShowCongratulations(true);
					}

					return;
				}

				// Only create a new test if we don't have one
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

				const { test } = await response.json();

				if (!test || !test.id) {
					throw new Error("Invalid test data received");
				}

				setTestId(test.id);
				setStartTime(new Date());

				// Update URL with test ID without triggering navigation
				window.history.replaceState(null, "", `/test=${test.id}`);
			} catch (error) {
				console.error("Error creating/loading test:", error);
				// Redirect back to home on error
				router.push("/");
			} finally {
				setIsCreatingTest(false);
			}
		};

		createTest();
	}, [hasAccess, user, router]);

	// Fetch existing test details and questions if we have a testId
	useEffect(() => {
		const loadInitialTestData = async () => {
			if (!testId || !hasAccess || !user) return;

			setIsLoadingQuestions(true);
			try {
				await fetchTestData();
			} catch (error) {
				console.error("Error fetching test data:", error);
			} finally {
				setIsLoadingQuestions(false);
			}
		};

		loadInitialTestData();
	}, [testId, hasAccess, user, fetchTestData]); // Add fetchTestData to dependencies

	useEffect(() => {
		// Redirect if not subscribed or not admin
		if (isLoaded && !isLoading && !hasAccess) {
			router.push("/");
		}
	}, [isLoaded, isLoading, hasAccess, router]);

	// Save answer to the test
	const saveAnswer = useCallback(
		async (questionId: string, selectedAnswer: string) => {
			if (!testId) return false;

			try {
				const response = await fetch(
					`/api/tests/testId/answers?testId=${testId}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							questionId,
							selectedAnswer,
						}),
					},
				);

				if (!response.ok) {
					console.error("Failed to save answer:", await response.text());
					return false;
				}

				// Immediately update the questionsAnswered state to reflect progress
				setQuestionsAnswered((prev) => {
					// Fetch latest answered count after saving
					return prev + 1;
				});

				// Refresh test data to get latest progress
				await fetchTestData();

				return true;
			} catch (error) {
				console.error("Error saving answer:", error);
				return false;
			}
		},
		[testId, fetchTestData],
	);

	// Complete the test when user finishes
	const completeTest = useCallback(async () => {
		if (!testId) return;

		const now = new Date();
		const durationMs = now.getTime() - startTime.getTime();
		const durationSecs = Math.floor(durationMs / 1000);

		try {
			const response = await fetch(`/api/tests/testId?testId=${testId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					status: "completed",
					completedAt: now.toISOString(),
					durationSeconds: durationSecs,
				}),
			});

			if (!response.ok) {
				console.error("Failed to complete test:", await response.text());
			}
		} catch (error) {
			console.error("Error completing test:", error);
		}
	}, [testId, startTime]);

	// Add a new function to handle checking answers
	const handleCheckAnswer = useCallback(async () => {
		if (!selectedOption || isAnswerRevealed || questions.length === 0) return;

		const currentQuestion = questions[currentQuestionIndex];
		if (!currentQuestion) return;

		setIsAnswerRevealed(true);

		// Save answer to test
		if (testId && currentQuestion.id) {
			await saveAnswer(currentQuestion.id, selectedOption);
			// Refresh test data to ensure progress is up-to-date
			await fetchTestData();
		}
	}, [
		selectedOption,
		isAnswerRevealed,
		testId,
		questions,
		currentQuestionIndex,
		saveAnswer,
		fetchTestData,
	]);

	// Define goToNextQuestion before it's used in handleKeyDown
	const goToNextQuestion = useCallback(() => {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
			setSelectedOption(null);
			setIsAnswerRevealed(false);
		} else {
			// Last question reviewed
			setShowCongratulations(true);
			completeTest();
		}
	}, [currentQuestionIndex, questions.length, completeTest]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			// Numeric keys 1-3 for selecting options
			if (e.key === "1" && !isAnswerRevealed) {
				setSelectedOption("A");
			} else if (e.key === "2" && !isAnswerRevealed) {
				setSelectedOption("B");
			} else if (e.key === "3" && !isAnswerRevealed) {
				setSelectedOption("C");
			} else if (
				e.key === "4" &&
				!isAnswerRevealed &&
				questions[currentQuestionIndex]?.optionD
			) {
				setSelectedOption("D");
			}

			// Space or Enter to check answer or continue
			if (e.key === " " || e.key === "Enter") {
				e.preventDefault();
				if (!isAnswerRevealed && selectedOption !== null) {
					handleCheckAnswer();
				} else if (isAnswerRevealed) {
					goToNextQuestion();
				}
			}
		},
		[
			isAnswerRevealed,
			selectedOption,
			goToNextQuestion,
			currentQuestionIndex,
			questions,
			handleCheckAnswer,
		],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	const selectOption = (option: string) => {
		if (!isAnswerRevealed) {
			setSelectedOption(option);
		}
	};

	if (!isLoaded || isLoading || isLoadingQuestions || isCreatingTest) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!hasAccess) {
		return null; // Will be redirected by the useEffect
	}

	if (questions.length === 0) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (showCongratulations) {
		return <CompletionCard onReturnHome={() => router.push("/")} />;
	}

	const currentQuestion = questions[currentQuestionIndex];

	return (
		<div className="w-full">
			<div className="max-w-3xl mx-auto">
				<PracticeHeader onBackToHome={() => router.push("/")} />

				<ProgressBar
					currentQuestionIndex={currentQuestionIndex}
					totalQuestions={questions.length}
					questionsAnswered={questionsAnswered}
					elapsedTime={elapsedTime}
				/>

				<QuestionCard
					question={currentQuestion}
					selectedOption={selectedOption}
					isAnswerRevealed={isAnswerRevealed}
					onOptionSelect={selectOption}
				/>

				<div className="flex justify-between mx-3 sm:mx-0">
					{!isAnswerRevealed ? (
						<Button
							onClick={handleCheckAnswer}
							disabled={selectedOption === null}
							className="w-full"
						>
							Check Answer{!isMobile && " (Space/Enter)"}
						</Button>
					) : (
						<Button onClick={goToNextQuestion} className="w-full">
							Next Question{!isMobile && " (Space/Enter)"}
						</Button>
					)}
				</div>

				{!isMobile && (
					<div className="mt-6 text-center text-sm text-muted-foreground mx-3 sm:mx-0">
						<p>
							Keyboard shortcuts: Press 1-4 to select an option, Space or Enter
							to check/continue
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

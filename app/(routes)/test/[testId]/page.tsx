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

interface TestPageProps {
	params: {
		testId: string;
	};
}

export default function TestPage({ params }: TestPageProps) {
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
				// Create a map of question IDs to their answers for quick lookup
				const answerMap = new Map();
				for (const answer of test.answers) {
					answerMap.set(answer.questionId, answer);
				}

				// Count how many questions have been answered
				const answeredCount = test.answers.filter(
					(answer: TestAnswer) => answer.selectedAnswer !== null,
				).length;
				setQuestionsAnswered(answeredCount);

				// Find the first unanswered question to set the currentQuestionIndex
				if (answeredCount < test.totalQuestions) {
					// Find the first unanswered question by checking each question in order
					let firstUnansweredIndex = -1;
					for (let i = 0; i < questions.length; i++) {
						const questionId = questions[i].id;
						const answer = answerMap.get(questionId);
						if (!answer || answer.selectedAnswer === null) {
							firstUnansweredIndex = i;
							break;
						}
					}

					// If we found an unanswered question, set the current index to it
					if (firstUnansweredIndex !== -1) {
						setCurrentQuestionIndex(firstUnansweredIndex);
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
		let lastUpdateTime = new Date();
		let isUserActive = true;
		let inactivityTimeout: NodeJS.Timeout | null = null;
		const INACTIVITY_THRESHOLD = 60000; // 1 minute of inactivity

		// Function to handle user activity
		const handleUserActivity = () => {
			// Clear any existing timeout
			if (inactivityTimeout) {
				clearTimeout(inactivityTimeout);
			}

			// If user was inactive, mark them as active again
			if (!isUserActive) {
				isUserActive = true;
				lastUpdateTime = new Date(); // Reset the last update time
			}

			// Set a new timeout to mark user as inactive after threshold
			inactivityTimeout = setTimeout(() => {
				isUserActive = false;
			}, INACTIVITY_THRESHOLD);
		};

		// Add event listeners for user activity
		document.addEventListener("mousemove", handleUserActivity);
		document.addEventListener("keydown", handleUserActivity);
		document.addEventListener("click", handleUserActivity);
		document.addEventListener("scroll", handleUserActivity);
		document.addEventListener("touchstart", handleUserActivity);

		// Also handle visibility changes
		const handleVisibilityChange = () => {
			if (document.visibilityState === "hidden") {
				isUserActive = false;
			} else {
				// When page becomes visible again, trigger activity handler
				handleUserActivity();
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		const updateDuration = async () => {
			// Only update if the user is active
			if (!isUserActive) return;

			try {
				const now = new Date();
				const durationMs = now.getTime() - lastUpdateTime.getTime();
				const durationSecs = Math.floor(durationMs / 1000);

				// Only update if there's actual time to add
				if (durationSecs > 0) {
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

					// Update the last update time
					lastUpdateTime = now;
				}
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
			if (inactivityTimeout) {
				clearTimeout(inactivityTimeout);
			}
			document.removeEventListener("mousemove", handleUserActivity);
			document.removeEventListener("keydown", handleUserActivity);
			document.removeEventListener("click", handleUserActivity);
			document.removeEventListener("scroll", handleUserActivity);
			document.removeEventListener("touchstart", handleUserActivity);
			document.removeEventListener("visibilitychange", handleVisibilityChange);

			// Final update when component unmounts
			updateDuration();
		};
	}, [testId, showCongratulations]);

	// Initialize test with the testId from the URL params
	useEffect(() => {
		// Skip if already mounted or if we don't have user data
		if (mountedRef.current || !hasAccess || !user) return;

		// Mark as mounted to prevent duplicate calls
		mountedRef.current = true;

		// Set the testId from the URL params
		if (params.testId) {
			setTestId(params.testId);

			// Check if this is a review
			const isReview = window.location.search.includes("review=true");
			if (isReview) {
				setShowCongratulations(true);
			}
		}
	}, [hasAccess, user, params.testId]);

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
				setQuestionsAnswered((prev) => prev + 1);

				// We don't need to refresh the entire test data after saving an answer
				// This was causing an unnecessary API call
				// await fetchTestData();

				return true;
			} catch (error) {
				console.error("Error saving answer:", error);
				return false;
			}
		},
		[testId],
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
			// We don't need to refresh test data after saving an answer
			// This was causing an unnecessary API call
			// await fetchTestData();
		}
	}, [
		selectedOption,
		isAnswerRevealed,
		testId,
		questions,
		currentQuestionIndex,
		saveAnswer,
	]);

	// Define goToNextQuestion before it's used in handleKeyDown
	const goToNextQuestion = useCallback(() => {
		if (currentQuestionIndex < questions.length - 1) {
			// Use a functional update to ensure we're working with the latest state
			setCurrentQuestionIndex((prev) => {
				// Double-check that we're not going beyond the array bounds
				const nextIndex = prev + 1;
				return nextIndex < questions.length ? nextIndex : prev;
			});
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

	// Add a useEffect to ensure we're properly handling the current question index
	useEffect(() => {
		// If we have questions and the current index is out of bounds, reset it
		if (questions.length > 0 && currentQuestionIndex >= questions.length) {
			setCurrentQuestionIndex(0);
		}
	}, [questions, currentQuestionIndex]);

	if (!isLoaded || isLoading || isLoadingQuestions) {
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

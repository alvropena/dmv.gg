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
	const [isReviewMode, setIsReviewMode] = useState(false);
	const [reviewQuestionsAnswered, setReviewQuestionsAnswered] = useState(0);
	const mountedRef = useRef(false);

	// Update hasAccess check to include free test case
	const hasAccess = hasActiveSubscription || dbUser?.role === "ADMIN" || !dbUser?.hasUsedFreeTest;

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

			// Check if this is a review
			const isReview = window.location.search.includes("review=true");

			// If test is completed and not in review mode, show congratulations
			if (test.status === "completed" && !isReview) {
				setShowCongratulations(true);
			}

			// Count answered questions
			if (test.answers && Array.isArray(test.answers)) {
				const answeredCount = test.answers.filter(
					(answer: TestAnswer) => answer.selectedAnswer !== null,
				).length;
				setQuestionsAnswered(answeredCount);
				
				// Set the current question index to the first unanswered question
				if (!isReview && test.status === "in_progress") {
					const firstUnansweredIndex = test.answers.findIndex(
						(answer: TestAnswer) => answer.selectedAnswer === null
					);
					if (firstUnansweredIndex !== -1) {
						setCurrentQuestionIndex(firstUnansweredIndex);
					}
				}
			}

			return test;
		} catch (error) {
			console.error("Error fetching test data:", error);
			router.push("/");
			return null;
		}
	}, [testId, hasAccess, user, router]);

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
				setIsReviewMode(true);
				setShowCongratulations(false);
				setCurrentQuestionIndex(0);
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
		// Redirect if not subscribed, not admin, and has used free test
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

		try {
			const response = await fetch(`/api/tests/testId?testId=${testId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					status: "completed",
					completedAt: new Date().toISOString(),
				}),
			});

			if (!response.ok) {
				console.error("Failed to complete test:", await response.text());
			}
		} catch (error) {
			console.error("Error completing test:", error);
		}
	}, [testId]);

	// Add a new function to handle checking answers in review mode
	const handleCheckAnswer = useCallback(async () => {
		if (!selectedOption || isAnswerRevealed || questions.length === 0) return;

		const currentQuestion = questions[currentQuestionIndex];
		if (!currentQuestion) return;

		setIsAnswerRevealed(true);

		// Determine if the answer is correct
		const isCorrect = selectedOption === currentQuestion.correctAnswer;
		
		// In review mode, increment reviewQuestionsAnswered instead
		if (isReviewMode) {
			setReviewQuestionsAnswered((prev) => prev + 1);
			// Also save answers in review mode to track weak areas
			if (testId && currentQuestion.id) {
				console.log(`Saving review answer - Question: ${currentQuestion.id}, Answer: ${selectedOption}, Correct: ${isCorrect}`);
				await saveAnswer(currentQuestion.id, selectedOption);
			}
		} else {
			// Save answer to test
			if (testId && currentQuestion.id) {
				console.log(`Saving regular answer - Question: ${currentQuestion.id}, Answer: ${selectedOption}, Correct: ${isCorrect}`);
				await saveAnswer(currentQuestion.id, selectedOption);
			}
		}
	}, [
		selectedOption,
		isAnswerRevealed,
		testId,
		questions,
		currentQuestionIndex,
		saveAnswer,
		isReviewMode,
	]);

	// Reset review progress when starting review mode
	useEffect(() => {
		if (isReviewMode) {
			setReviewQuestionsAnswered(0);
		}
	}, [isReviewMode]);

	// Modify goToNextQuestion
	const goToNextQuestion = useCallback(() => {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex((prev) => {
				const nextIndex = prev + 1;
				return nextIndex < questions.length ? nextIndex : prev;
			});
			setSelectedOption(null);
			setIsAnswerRevealed(false);
		} else {
			// Last question reviewed
			const isReview = window.location.search.includes("review=true");
			if (isReview) {
				setShowCongratulations(true);
				// Also complete the review test so it's marked as finished in the database
				completeTest();
			} else {
				setShowCongratulations(true);
				completeTest();
			}
		}
	}, [currentQuestionIndex, questions.length, completeTest]);

	// Modify goToPreviousQuestion
	const goToPreviousQuestion = useCallback(() => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex((prev) => prev - 1);
			setSelectedOption(null);
			setIsAnswerRevealed(false);
			// Decrease the questions answered count when going back
			if (!isReviewMode) {
				setQuestionsAnswered((prev) => prev - 1);
			} else {
				setReviewQuestionsAnswered((prev) => prev - 1);
			}
		}
	}, [currentQuestionIndex, isReviewMode]);

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

			// Left arrow to go to previous question
			if (e.key === "ArrowLeft" && currentQuestionIndex > 0) {
				e.preventDefault();
				goToPreviousQuestion();
			}

			// Right arrow to go to next question (only if answer is revealed)
			if (e.key === "ArrowRight" && isAnswerRevealed) {
				e.preventDefault();
				goToNextQuestion();
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
			goToPreviousQuestion,
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
		<div className="relative min-h-screen bg-white flex items-center justify-center">
			<div className="w-full flex items-center justify-center overflow-hidden px-4 py-8">
				<div className="max-w-3xl w-full">
					<ProgressBar
						totalQuestions={questions.length}
						questionsAnswered={
							isReviewMode ? reviewQuestionsAnswered : questionsAnswered
						}
						currentQuestionIndex={currentQuestionIndex}
						currentQuestion={{
							title: currentQuestion.title,
							id: currentQuestion.id,
						}}
					/>

					<QuestionCard
						question={currentQuestion}
						selectedOption={selectedOption}
						isAnswerRevealed={isAnswerRevealed}
						onOptionSelect={selectOption}
					/>

					<div className="flex justify-between gap-4 sm:mx-0">
						{currentQuestionIndex > 0 && (
							<Button
								onClick={goToPreviousQuestion}
								variant="outline"
								className="w-full"
							>
								Previous Question
							</Button>
						)}
						{isReviewMode ? (
							<>
								{!isAnswerRevealed ? (
									<Button
										onClick={handleCheckAnswer}
										disabled={selectedOption === null}
										className="w-full"
									>
										Check Answer{!isMobile && " (Space/Enter)"}
									</Button>
								) : (
									<div className="flex gap-2 w-full">
										<Button onClick={goToNextQuestion} className="w-full">
											{currentQuestionIndex < questions.length - 1 ? (
												<>Next Question{!isMobile && " (Space/Enter)"}</>
											) : (
												"Finish Review"
											)}
										</Button>
									</div>
								)}
							</>
						) : (
							<>
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
							</>
						)}
					</div>

					{!isMobile && (
						<div className="mt-6 text-center text-sm text-muted-foreground">
							<p>
								Keyboard shortcuts: Press 1-4 to select an option, Space or
								Enter to check/continue, Left/Right arrows to navigate between
								questions
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

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

export default function PracticeTestPage() {
	const { user, isLoaded } = useUser();
	const router = useRouter();
	const { hasActiveSubscription, isLoading } = useAuthContext();
	const isMobile = useIsMobile();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
	const [questionsAnswered, setQuestionsAnswered] = useState(0);
	const [questions, setQuestions] = useState<Question[]>([]);
	const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
	const [showCongratulations, setShowCongratulations] = useState(false);
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [isCreatingSession, setIsCreatingSession] = useState(true);
	const [startTime, setStartTime] = useState<Date>(new Date());
	const mountedRef = useRef(false);

	// Use the custom timer hook
	const elapsedTime = useTimer(startTime);

	// Create a new study session - only once on mount
	useEffect(() => {
		// Skip if already mounted or if we don't have user data
		if (mountedRef.current || !hasActiveSubscription || !user) return;

		// Mark as mounted to prevent duplicate calls
		mountedRef.current = true;

		const createStudySession = async () => {
			try {
				// Check if there's already a session ID in the URL
				const urlParams = new URLSearchParams(window.location.search);
				const urlSessionId = urlParams.get("session");

				// If URL already has a session ID, use that instead of creating a new one
				if (urlSessionId) {
					setSessionId(urlSessionId);
					setIsCreatingSession(false);
					return;
				}

				// Only create a new session if we don't have one
				setIsCreatingSession(true);
				const response = await fetch("/api/study-sessions", {
					method: "POST",
				});

				if (!response.ok) throw new Error("Failed to create study session");

				const { session } = await response.json();
				setSessionId(session.id);
				setStartTime(new Date());

				// Update URL with session ID without triggering navigation
				window.history.replaceState(
					null,
					"",
					`/practice?session=${session.id}`,
				);
			} catch (error) {
				console.error("Error creating study session:", error);
			} finally {
				setIsCreatingSession(false);
			}
		};

		createStudySession();
	}, [hasActiveSubscription, user]); // No sessionId dependency to prevent re-runs

	// Fetch existing session details and questions if we have a sessionId
	useEffect(() => {
		const fetchSessionData = async () => {
			if (!sessionId || !hasActiveSubscription || !user) return;

			setIsLoadingQuestions(true);
			try {
				const response = await fetch(`/api/study-sessions/${sessionId}`);
				if (!response.ok) throw new Error("Failed to fetch session");

				const { session, questions } = await response.json();

				// Set the questions for the test
				if (questions && Array.isArray(questions)) {
					setQuestions(questions);
				}

				// If this is a session being restored, set the start time
				if (session.startedAt) {
					setStartTime(new Date(session.startedAt));
				}

				// If session is completed, show congratulations
				if (session.status === "completed") {
					setShowCongratulations(true);
				}

				// Restore the user's progress in the session
				if (session.answers && Array.isArray(session.answers)) {
					// Count how many questions have been answered
					const answeredCount = session.answers.filter(
						(answer: any) => answer.selectedAnswer !== null
					).length;
					setQuestionsAnswered(answeredCount);

					// Find the last unanswered question to set the currentQuestionIndex
					if (answeredCount < session.totalQuestions) {
						const nextUnansweredIndex = session.answers.findIndex(
							(answer: any) => answer.selectedAnswer === null
						);
						if (nextUnansweredIndex !== -1) {
							setCurrentQuestionIndex(nextUnansweredIndex);
						}
					}
				}
			} catch (error) {
				console.error("Error fetching session data:", error);
			} finally {
				setIsLoadingQuestions(false);
			}
		};

		fetchSessionData();
	}, [sessionId, hasActiveSubscription, user]);

	useEffect(() => {
		// Redirect if not subscribed
		if (isLoaded && !isLoading && !hasActiveSubscription) {
			router.push("/");
		}
	}, [isLoaded, isLoading, hasActiveSubscription, router]);

	// Save answer to the session
	const saveAnswer = async (questionId: string, selectedAnswer: string) => {
		if (!sessionId) return;

		try {
			const response = await fetch(`/api/study-sessions/${sessionId}/answers`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					questionId,
					selectedAnswer,
				}),
			});

			if (!response.ok) {
				console.error("Failed to save answer:", await response.text());
			}
		} catch (error) {
			console.error("Error saving answer:", error);
		}
	};

	// Complete the session when user finishes
	const completeSession = useCallback(async () => {
		if (!sessionId) return;

		const now = new Date();
		const durationMs = now.getTime() - startTime.getTime();
		const durationSecs = Math.floor(durationMs / 1000);

		try {
			const response = await fetch(`/api/study-sessions/${sessionId}`, {
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
				console.error("Failed to complete session:", await response.text());
			}
		} catch (error) {
			console.error("Error completing session:", error);
		}
	}, [sessionId, startTime]);

	// Define goToNextQuestion before it's used in handleKeyDown
	const goToNextQuestion = useCallback(() => {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
			setSelectedOption(null);
			setIsAnswerRevealed(false);
			setQuestionsAnswered((prev) => prev + 1);
		} else {
			// Last question reviewed
			setQuestionsAnswered(questions.length);
			setShowCongratulations(true);
			completeSession();
		}
	}, [currentQuestionIndex, questions.length, completeSession]);

	// Add a new function to handle checking answers
	const handleCheckAnswer = useCallback(() => {
		if (!selectedOption || isAnswerRevealed || questions.length === 0) return;

		const currentQuestion = questions[currentQuestionIndex];
		if (!currentQuestion) return;

		setIsAnswerRevealed(true);

		// Save answer to session
		if (sessionId && currentQuestion.id) {
			saveAnswer(currentQuestion.id, selectedOption);
		}
	}, [
		selectedOption,
		isAnswerRevealed,
		sessionId,
		questions,
		currentQuestionIndex,
		saveAnswer,
	]);

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

	if (!isLoaded || isLoading || isLoadingQuestions || isCreatingSession) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!hasActiveSubscription) {
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

				<div className="flex justify-between">
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
					<div className="mt-6 text-center text-sm text-muted-foreground">
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

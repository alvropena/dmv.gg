"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Trophy,
	ArrowRight,
	FileText,
	Lock,
	Calendar,
	CheckCircle,
	Trash2,
} from "lucide-react";
import { UserResource } from "@clerk/types";
import { QuizComplete } from "../quiz/QuizComplete";
import { Badge } from "@/components/ui/badge";
import { StudySession } from "@/types";
import { DeleteSessionDialog } from "./DeleteSessionDialog";

interface UserDashboardProps {
	user: UserResource;
	hasActiveSubscription: boolean;
	onStartQuiz: () => void;
	onLearnClick: () => void;
	isComplete?: boolean;
	score?: number;
	totalQuestions?: number;
	progressPercentage?: number;
	onReset?: () => void;
}

export function UserDashboard({
	user,
	hasActiveSubscription,
	onStartQuiz,
	onLearnClick,
	isComplete,
	score = 0,
	totalQuestions = 0,
	progressPercentage = 0,
	onReset,
}: UserDashboardProps) {
	const firstName = user.firstName || user.fullName?.split(" ")[0] || "there";
	const [studySessions, setStudySessions] = useState<StudySession[]>([]);
	const [isLoadingSessions, setIsLoadingSessions] = useState(true);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

	useEffect(() => {
		// Fetch user's study sessions
		const fetchStudySessions = async () => {
			try {
				setIsLoadingSessions(true);
				const response = await fetch("/api/study-sessions");

				if (!response.ok) {
					throw new Error("Failed to fetch study sessions");
				}

				const { sessions } = await response.json();
				setStudySessions(sessions);
			} catch (error) {
				console.error("Error fetching study sessions:", error);
			} finally {
				setIsLoadingSessions(false);
			}
		};

		if (hasActiveSubscription) {
			fetchStudySessions();
		}
	}, [hasActiveSubscription]);

	// Calculate stats from study sessions
	const completedSessions = studySessions.filter(
		(session) => session.status === "completed",
	);

	const averageScore =
		completedSessions.length > 0
			? Math.round(
					completedSessions.reduce(
						(acc, session) =>
							acc + (session.score / session.totalQuestions) * 100,
						0,
					) / completedSessions.length,
				)
			: 0;

	const handleDeleteClick = (sessionId: string) => {
		setSessionToDelete(sessionId);
		setDeleteDialogOpen(true);
	};

	const handleDeleteSuccess = () => {
		// Refresh sessions after successful deletion
		if (hasActiveSubscription) {
			// Re-fetch the sessions
			const fetchAgain = async () => {
				try {
					setIsLoadingSessions(true);
					const response = await fetch("/api/study-sessions");

					if (!response.ok) {
						throw new Error("Failed to fetch study sessions");
					}

					const { sessions } = await response.json();
					setStudySessions(sessions);
				} catch (error) {
					console.error("Error fetching study sessions:", error);
				} finally {
					setIsLoadingSessions(false);
				}
			};

			fetchAgain();
		}
	};

	return (
		<div className="w-full max-w-3xl mx-auto px-4">
			<Card className="mb-8">
				<CardHeader>
					<CardTitle className="text-2xl">Welcome back, {firstName}!</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground mb-6">
						Glad to see you again. Ready to continue your DMV test practice?
					</p>
					<div className="flex items-center gap-4 mt-6 flex-wrap">
						<Button onClick={onStartQuiz} className="flex items-center gap-2">
							{!hasActiveSubscription ? (
								<Lock className="h-4 w-4" />
							) : (
								<ArrowRight className="h-4 w-4" />
							)}
							Practice Test
						</Button>
						<Button
							onClick={onLearnClick}
							variant="outline"
							className="flex items-center gap-2"
						>
							<FileText className="h-4 w-4" />
							DMV Handbook
						</Button>
					</div>
				</CardContent>
			</Card>

			<div className="mb-6">
				<h2 className="text-xl font-semibold mb-4">Your Progress</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardContent className="pt-6">
							<div className="flex flex-col items-center">
								<Trophy className="h-8 w-8 text-yellow-500 mb-2" />
								<h3 className="font-semibold text-xl">
									{completedSessions.length}
								</h3>
								<p className="text-muted-foreground text-sm">Tests Completed</p>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="flex flex-col items-center">
								<h3 className="font-semibold text-xl">{averageScore}%</h3>
								<p className="text-muted-foreground text-sm">Average Score</p>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="flex flex-col items-center">
								<h3 className="font-semibold text-xl">
									{completedSessions.length > 0
										? completedSessions[0].score
										: 0}
								</h3>
								<p className="text-muted-foreground text-sm">Last Score</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{hasActiveSubscription && (
				<div className="mb-8">
					<h2 className="text-xl font-semibold mb-4">Recent Study Sessions</h2>
					{isLoadingSessions ? (
						<p className="text-center py-4">Loading sessions...</p>
					) : studySessions.length === 0 ? (
						<p className="text-center py-4 text-muted-foreground">
							No study sessions yet. Start practicing!
						</p>
					) : (
						<div className="space-y-4">
							{studySessions.slice(0, 5).map((session) => (
								<Card key={session.id}>
									<CardContent className="py-4">
										<div className="flex flex-col">
											<div className="flex items-center justify-between mb-2">
												<div className="flex items-center gap-2">
													<Calendar className="h-4 w-4 text-muted-foreground" />
													<span className="text-sm font-medium">
														{new Date(session.startedAt).toLocaleDateString()}{" "}
														at{" "}
														{new Date(session.startedAt).toLocaleTimeString(
															[],
															{ hour: "2-digit", minute: "2-digit" },
														)}
													</span>
													<Badge
														variant={
															session.status === "completed"
																? "success"
																: "secondary"
														}
													>
														{session.status === "completed" ? (
															<span className="flex items-center gap-1">
																<CheckCircle className="h-3 w-3" /> Completed
															</span>
														) : (
															"In Progress"
														)}
													</Badge>
												</div>
												<div className="flex items-center gap-2">
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleDeleteClick(session.id)}
														className="h-8 w-8 text-muted-foreground hover:text-destructive"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={() =>
															(window.location.href = `/practice?session=${session.id}`)
														}
													>
														{session.status === "completed"
															? "Review"
															: "Continue"}
													</Button>
												</div>
											</div>

											<div className="grid grid-cols-1 gap-2 mt-2 border-t pt-2">
												{/* Progress row */}
												<div className="flex flex-wrap justify-between items-center">
													<div className="text-sm">
														<span className="text-muted-foreground">
															Progress:
														</span>{" "}
														<span className="font-medium">
															{(() => {
																// Calculate completed questions count
																const completedCount =
																	session.answers &&
																	Array.isArray(session.answers)
																		? session.answers.filter(
																				(a) => a.selectedAnswer,
																			).length
																		: session.score;

																// Calculate progress percentage
																const progressPercent = Math.round(
																	(completedCount / session.totalQuestions) *
																		100,
																);

																// Calculate remaining questions
																const remainingCount =
																	session.totalQuestions - completedCount;

																return (
																	<>
																		<span className="text-primary">
																			{progressPercent}%
																		</span>{" "}
																		({completedCount} completed,{" "}
																		{remainingCount} left)
																	</>
																);
															})()}
														</span>
													</div>

													<div className="text-sm">
														<span className="text-muted-foreground">
															Time spent:
														</span>{" "}
														<span className="font-medium">
															{session.durationSeconds
																? `${Math.floor(session.durationSeconds / 60)}m ${session.durationSeconds % 60}s`
																: `In progress`}
														</span>
													</div>
												</div>

												{/* Last question row */}
												{session.answers && Array.isArray(session.answers) && (
													<div className="text-sm mt-1">
														<span className="text-muted-foreground">
															Last question:
														</span>{" "}
														<span className="font-medium">
															{(() => {
																// Find the last answered question
																const answeredQuestions =
																	session.answers &&
																	Array.isArray(session.answers)
																		? session.answers
																				.filter((a) => a.selectedAnswer)
																				.sort(
																					(a, b) =>
																						new Date(
																							(b.answeredAt ||
																								new Date(0)) as Date,
																						).getTime() -
																						new Date(
																							(a.answeredAt ||
																								new Date(0)) as Date,
																						).getTime(),
																				)
																		: [];

																if (answeredQuestions.length > 0) {
																	const lastAnswer = answeredQuestions[0];
																	// Find the question index if possible
																	const questionNumber = session.answers
																		? session.answers.findIndex(
																				(a) =>
																					a.questionId ===
																					lastAnswer.questionId,
																			) + 1
																		: 1;

																	// Access the question title if available
																	if (
																		lastAnswer.question &&
																		lastAnswer.question.title
																	) {
																		return `#${questionNumber}: ${lastAnswer.question.title}`;
																	} else {
																		return `Question #${questionNumber}`;
																	}
																} else if (session.status === "in_progress") {
																	return "Ready to start";
																} else {
																	return "Session completed";
																}
															})()}
														</span>
													</div>
												)}

												{/* Score row - only for completed sessions */}
												{session.status === "completed" && (
													<div className="text-sm mt-1">
														<span className="text-muted-foreground">
															Final score:
														</span>{" "}
														<span className="font-medium">
															{session.score}/{session.totalQuestions} (
															{Math.round(
																(session.score / session.totalQuestions) * 100,
															)}
															%)
														</span>
													</div>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			)}

			{isComplete && onReset && (
				<QuizComplete
					score={score}
					totalQuestions={totalQuestions}
					progressPercentage={progressPercentage}
					onReset={onReset}
				/>
			)}

			{/* Confirmation Dialog */}
			{sessionToDelete && (
				<DeleteSessionDialog
					isOpen={deleteDialogOpen}
					onClose={() => setDeleteDialogOpen(false)}
					sessionId={sessionToDelete}
					onDeleteSuccess={handleDeleteSuccess}
				/>
			)}
		</div>
	);
}

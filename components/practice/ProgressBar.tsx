import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface ProgressBarProps {
	totalQuestions: number;
	questionsAnswered: number;
	currentQuestionIndex: number;
	currentQuestion?: {
		title: string;
		id: string;
	};
}

export function ProgressBar({
	totalQuestions,
	questionsAnswered,
	currentQuestionIndex,
	currentQuestion,
}: ProgressBarProps) {
	const router = useRouter();
	const [showDialog, setShowDialog] = useState(false);
	const [showFlagDialog, setShowFlagDialog] = useState(false);
	const [flagReason, setFlagReason] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const progressPercentage = (questionsAnswered / totalQuestions) * 100;
	const currentQuestionNumber = currentQuestionIndex + 1;

	const toggleDialog = useCallback(() => {
		setShowDialog((prev) => !prev);
	}, []);

	// Handle ESC key press only when dialog is not open
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !showDialog) {
				event.preventDefault();
				toggleDialog();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [showDialog, toggleDialog]);

	const handleExit = () => {
		router.push("/");
	};

	const handleFlag = async () => {
		if (!flagReason.trim()) {
			toast.error("Please provide a reason for flagging this question.");
			return;
		}

		if (!currentQuestion?.id) {
			toast.error("Question ID is missing.");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/questions/flag", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					questionId: currentQuestion.id,
					reason: flagReason,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message);
			}

			toast.success(
				"Question flagged successfully. Thank you for your feedback!",
			);
			setShowFlagDialog(false);
			setFlagReason(""); // Reset the input
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to flag question. Please try again later.",
			);
			console.error("Error flagging question:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="mb-6 sm:mx-0">
			<div className="flex justify-between items-center mb-4 md:mb-6">
				<Badge
					variant="outline"
					className="text-sm md:text-lg py-1 md:py-2 px-4 md:px-6 bg-white rounded-full"
				>
					Question {currentQuestionNumber}/{totalQuestions}
				</Badge>
				<div className="flex items-center gap-2 md:gap-4">
					<Badge
						variant="destructive"
						onClick={() => setShowFlagDialog(true)}
						className="text-sm md:text-lg py-1 md:py-2 px-4 md:px-6 rounded-full cursor-pointer hover:opacity-90 flex items-center gap-1 font-light justify-center"
					>
						Flag
					</Badge>
					<Button
						variant="ghost"
						size="sm"
						onClick={toggleDialog}
						className="h-6 md:h-8 px-2 md:px-3 hover:bg-gray-800/50"
						aria-label="Exit test"
					>
						<X className="h-4 md:h-6 w-4 md:w-6" />
					</Button>
				</div>
			</div>

			<div className="w-full bg-white dark:bg-slate-700 rounded-full h-2 md:h-3 mb-6 md:mb-10 border border-input">
				<div
					className="bg-[#000099] h-2 md:h-3 rounded-full transition-all duration-300 ease-in-out"
					style={{
						width: `${progressPercentage}%`,
					}}
				/>
			</div>

			<Dialog open={showDialog} onOpenChange={setShowDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Exit Test?</DialogTitle>
						<DialogDescription>
							Are you sure you want to exit? Your progress will be saved, but
							you&apos;ll need to start from the beginning next time.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex gap-2 mt-4">
						<Button variant="outline" onClick={toggleDialog}>
							Continue Test
						</Button>
						<Button variant="destructive" onClick={handleExit}>
							Exit Test
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
				<DialogContent
					className="sm:max-w-[425px]"
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
					onKeyPress={(e) => e.stopPropagation()}
				>
					<DialogHeader>
						<DialogTitle>Is this question incorrect?</DialogTitle>
					</DialogHeader>
					<div>
						<div className="mb-4 text-sm font-medium text-muted-foreground">
							<span className="font-semibold">Question</span>:{" "}
							{currentQuestion?.title || "Current question"}
						</div>
						<textarea
							className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm"
							placeholder="Please, tell us why you think this question is incorrect and we will review it."
							value={flagReason}
							onChange={(e) => setFlagReason(e.target.value)}
						/>
					</div>
					<DialogFooter>
						<Button
							variant="destructive"
							onClick={handleFlag}
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								"Submit Flag"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

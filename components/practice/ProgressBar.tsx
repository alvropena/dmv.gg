import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Flag } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";

interface ProgressBarProps {
	totalQuestions: number;
	questionsAnswered: number;
	currentQuestionIndex: number;
	isReviewMode?: boolean;
	currentQuestion?: {
		title: string;
		id: string;
	};
}

export function ProgressBar({
	totalQuestions,
	questionsAnswered,
	currentQuestionIndex,
	isReviewMode = false,
	currentQuestion,
}: ProgressBarProps) {
	const router = useRouter();
	const [showExitDialog, setShowExitDialog] = useState(false);
	const [showFlagDialog, setShowFlagDialog] = useState(false);
	const [flagReason, setFlagReason] = useState("");
	const progressPercentage = (questionsAnswered / totalQuestions) * 100;
	const currentQuestionNumber = currentQuestionIndex + 1;

	const toggleDialog = useCallback(() => {
		setShowExitDialog((prev) => !prev);
	}, []);

	// Handle ESC key press only when dialog is not open
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !showExitDialog) {
				event.preventDefault();
				toggleDialog();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [showExitDialog, toggleDialog]);

	const handleExit = () => {
		router.push("/");
	};

	const handleFlag = () => {
		// Here you would implement the actual flagging logic
		// You can use the flagReason state and currentQuestion.id
		console.log(
			"Flagging question:",
			currentQuestion?.id,
			"Reason:",
			flagReason,
		);
		setShowFlagDialog(false);
		setFlagReason(""); // Reset the input
	};

	return (
		<>
			<div className="flex justify-between items-center mb-4 mx-3 sm:mx-0">
				<Badge variant="outline" className="text-sm py-1">
					Question {currentQuestionNumber}/{totalQuestions}
				</Badge>
				<div className="flex items-center gap-2">
					{isReviewMode && (
						<Badge variant="secondary" className="text-sm py-1">
							Review
						</Badge>
					)}
					<Button
						variant="destructive"
						size="sm"
						onClick={() => setShowFlagDialog(true)}
						className="h-6 px-2 gap-2"
						aria-label="Flag question"
					>
						<Flag className="h-4 w-4" />
						<span className="text-sm">Flag</span>
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={toggleDialog}
						className="h-6 px-2 hover:bg-gray-800/50"
						aria-label="Exit test"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<Progress
				value={progressPercentage}
				className={`mb-6 mx-3 sm:mx-0 ${isReviewMode ? "bg-secondary" : ""}`}
			/>

			<Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
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
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Is this question incorrect?</DialogTitle>
					</DialogHeader>
					<div className="py-2">
						<div className="mb-4 text-sm font-medium text-muted-foreground">
							{currentQuestion?.title || "Current question"}
						</div>
						<Input
							placeholder="What's wrong with this question?"
							value={flagReason}
							onChange={(e) => setFlagReason(e.target.value)}
							className="mb-4"
						/>
					</div>
					<DialogFooter>
						<Button variant="destructive" onClick={handleFlag}>
							Submit Flag
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

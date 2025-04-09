import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProgressBarProps {
	totalQuestions: number;
	questionsAnswered: number;
	elapsedTime: string;
}

export function ProgressBar({
	totalQuestions,
	questionsAnswered,
	elapsedTime,
}: ProgressBarProps) {
	const progressPercentage = (questionsAnswered / totalQuestions) * 100;
	// Calculate the current question number based on answered questions
	const currentQuestionNumber = questionsAnswered + 1;

	return (
		<>
			<div className="flex justify-between items-center mb-4 mx-3 sm:mx-0">
				<Badge variant="outline" className="text-sm">
					Question {currentQuestionNumber}/{totalQuestions}
				</Badge>
				<Badge variant="outline">Time: {elapsedTime}</Badge>
			</div>

			<Progress value={progressPercentage} className="mb-6 mx-3 sm:mx-0" />
		</>
	);
}

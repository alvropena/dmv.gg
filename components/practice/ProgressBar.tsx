import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProgressBarProps {
	currentQuestionIndex: number;
	totalQuestions: number;
	questionsAnswered: number;
	elapsedTime: string;
}

export function ProgressBar({
	currentQuestionIndex,
	totalQuestions,
	questionsAnswered,
	elapsedTime,
}: ProgressBarProps) {
	const progressPercentage = (questionsAnswered / totalQuestions) * 100;

	return (
		<>
			<div className="flex items-center gap-2 mb-6">
				<Badge variant="outline" className="ml-auto">
					Time: {elapsedTime}
				</Badge>
			</div>

			<div className="flex justify-between items-center mb-4">
				<Badge variant="outline" className="text-sm">
					Question {currentQuestionIndex + 1}/{totalQuestions}
				</Badge>
			</div>

			<Progress value={progressPercentage} className="mb-6" />
		</>
	);
}

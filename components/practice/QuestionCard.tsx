import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import type { Question } from "@/types";

interface QuestionCardProps {
	question: Question;
	selectedOption: string | null;
	isAnswerRevealed: boolean;
	onOptionSelect: (option: string) => void;
}

export function QuestionCard({
	question,
	selectedOption,
	isAnswerRevealed,
	onOptionSelect,
}: QuestionCardProps) {
	const options = [
		{ key: "A", text: question.optionA, number: "1" },
		{ key: "B", text: question.optionB, number: "2" },
		{ key: "C", text: question.optionC, number: "3" },
		{ key: "D", text: question.optionD, number: "4" },
	];

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>{question.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3 mt-4">
					{options.map((option) => (
						<button
							type="button"
							key={option.key}
							className={`p-3 border rounded-lg cursor-pointer flex items-center w-full text-left ${
								selectedOption === option.key
									? "bg-primary/10 border-primary"
									: "hover:bg-muted/50"
							} ${
								isAnswerRevealed && option.key === question.correctAnswer
									? "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500"
									: ""
							} ${
								isAnswerRevealed &&
								selectedOption === option.key &&
								option.key !== question.correctAnswer
									? "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-500"
									: ""
							}`}
							onClick={() => onOptionSelect(option.key)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									onOptionSelect(option.key);
								}
							}}
							aria-label={`Option ${option.number}: ${option.text}`}
						>
							<div className="flex-1">
								<span className="font-medium mr-2">{option.number}.</span>
								{option.text}
							</div>
							{isAnswerRevealed && option.key === question.correctAnswer && (
								<CheckCircle className="h-5 w-5 text-green-500 ml-2" />
							)}
							{isAnswerRevealed &&
								selectedOption === option.key &&
								option.key !== question.correctAnswer && (
									<XCircle className="h-5 w-5 text-red-500 ml-2" />
								)}
						</button>
					))}
				</div>

				{isAnswerRevealed && (
					<div
						className={`mt-6 p-4 rounded-lg border ${
							selectedOption && selectedOption === question.correctAnswer
								? "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-500"
								: "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-500"
						}`}
					>
						<h3 className="font-medium text-lg mb-2">Explanation:</h3>
						<p>{question.explanation}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

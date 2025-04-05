import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";

interface QuestionFormProps {
	formData: {
		title: string;
		optionA: string;
		optionB: string;
		optionC: string;
		optionD: string;
		correctAnswer: string;
		explanation: string;
	};
	open: boolean;
	onOpenChange: (open: boolean) => void;
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
	handleSubmit: (e: React.FormEvent) => void;
}

export function QuestionForm({
	formData,
	open,
	onOpenChange,
	handleChange,
	handleSubmit,
}: QuestionFormProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle className="text-lg font-bold">Add Question</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-3">
						<div className="space-y-1">
							<Label htmlFor="title" className="text-sm">
								Title
							</Label>
							<Input
								id="title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								placeholder="Enter the question"
								required
							/>
						</div>

						<div className="space-y-1">
							<Label htmlFor="optionA" className="text-sm">
								Option A
							</Label>
							<Input
								id="optionA"
								name="optionA"
								value={formData.optionA}
								onChange={handleChange}
								placeholder="Enter option A"
								required
							/>
						</div>

						<div className="space-y-1">
							<Label htmlFor="optionB" className="text-sm">
								Option B
							</Label>
							<Input
								id="optionB"
								name="optionB"
								value={formData.optionB}
								onChange={handleChange}
								placeholder="Enter option B"
								required
							/>
						</div>

						<div className="space-y-1">
							<Label htmlFor="optionC" className="text-sm">
								Option C
							</Label>
							<Input
								id="optionC"
								name="optionC"
								value={formData.optionC}
								onChange={handleChange}
								placeholder="Enter option C"
								required
							/>
						</div>

						<div className="space-y-1">
							<Label htmlFor="optionD" className="text-sm">
								Option D (Optional)
							</Label>
							<Input
								id="optionD"
								name="optionD"
								value={formData.optionD}
								onChange={handleChange}
								placeholder="Enter option D (optional)"
							/>
						</div>

						<div className="space-y-1">
							<Label htmlFor="correctAnswer" className="text-sm">
								Correct Answer
							</Label>
							<Input
								id="correctAnswer"
								name="correctAnswer"
								value={formData.correctAnswer}
								onChange={handleChange}
								placeholder="Enter the correct answer (A, B, C, or D)"
								required
								pattern="[ABCDabcd]"
								maxLength={1}
							/>
						</div>

						<div className="space-y-1">
							<Label htmlFor="explanation" className="text-sm">
								Explanation
							</Label>
							<Textarea
								id="explanation"
								name="explanation"
								value={formData.explanation}
								onChange={handleChange}
								placeholder="Explain why this answer is correct"
								required
								rows={3}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" className="text-sm">
							Submit
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

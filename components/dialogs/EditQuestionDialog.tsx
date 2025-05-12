"use client";

import type { Question } from "@/types";
import { AddQuestionDialog } from "@/components/dialogs/AddQuestionDialog";
import { useEffect, useState } from "react";

interface EditQuestionDialogProps {
	question: Omit<Question, "answers" | "tests" | "flags"> | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onQuestionUpdated: () => void;
}

export function EditQuestionDialog({
	question,
	open,
	onOpenChange,
	onQuestionUpdated,
}: EditQuestionDialogProps) {
	const [triggerClick, setTriggerClick] = useState(false);

	// When the dialog should open, trigger a click on the hidden button
	useEffect(() => {
		if (open && question) {
			setTriggerClick(true);

			// Reset after a small delay to allow for re-triggering
			const timeout = setTimeout(() => {
				setTriggerClick(false);
			}, 100);

			return () => clearTimeout(timeout);
		}
	}, [open, question]);

	// When the AddQuestionDialog closes, notify the parent
	const handleDialogChange = (isOpen: boolean) => {
		if (!isOpen) {
			onOpenChange(false);
		}
	};

	// Hide dialog if no question is selected
	if (!question) return null;

	// Create a complete Question object with empty arrays for the required properties
	const completeQuestion: Question = {
		...question,
		answers: [],
		tests: [],
		flags: [],
	};

	return (
		<AddQuestionDialog
			question={completeQuestion}
			isEdit={true}
			onQuestionAdded={onQuestionUpdated}
			trigger={
				<button
					type="button"
					id="edit-question-trigger"
					className="hidden"
					onClick={() => triggerClick && setTriggerClick(false)}
					ref={(button) => {
						if (button && triggerClick) {
							button.click();
						}
					}}
				>
					Edit
				</button>
			}
			onOpenChange={handleDialogChange}
		/>
	);
}

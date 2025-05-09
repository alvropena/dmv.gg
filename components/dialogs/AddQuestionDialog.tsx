"use client";

import { useState, useRef, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Upload, X } from "lucide-react";
import { addQuestion, updateQuestion } from "@/app/actions/questions";
import { toast } from "@/hooks/use-toast";
import type { Question } from "@/types";
import Image from "next/image";

interface AddQuestionDialogProps {
	onQuestionAdded?: () => void;
	question?: Question;
	isEdit?: boolean;
	trigger?: React.ReactNode;
	onOpenChange?: (open: boolean) => void;
}

export function AddQuestionDialog({
	onQuestionAdded,
	question,
	isEdit = false,
	trigger,
	onOpenChange,
}: AddQuestionDialogProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		optionA: "",
		optionB: "",
		optionC: "",
		optionD: "",
		correctAnswer: "",
		explanation: "",
		image: null as File | null,
	});
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const titleInputRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Populate form data when editing an existing question
	useEffect(() => {
		if (question && isEdit) {
			setFormData({
				title: question.title,
				optionA: question.optionA,
				optionB: question.optionB,
				optionC: question.optionC,
				optionD: question.optionD || "",
				correctAnswer: question.correctAnswer,
				explanation: question.explanation,
				image: null,
			});
			if (question.image) {
				setPreviewUrl(question.image);
			}
		}
	}, [question, isEdit]);

	// Focus on title input when dialog opens
	useEffect(() => {
		if (open && titleInputRef.current) {
			setTimeout(() => {
				titleInputRef.current?.focus();
			}, 100);
		}
	}, [open]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				// 5MB limit
				toast({
					title: "File too large",
					description: "Image must be less than 5MB",
					variant: "destructive",
				});
				return;
			}
			setFormData((prev) => ({ ...prev, image: file }));
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		}
	};

	const removeImage = () => {
		setFormData((prev) => ({ ...prev, image: null }));
		setPreviewUrl(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Validate correct answer format
			const correctAnswer = formData.correctAnswer.trim().toUpperCase();
			if (!["A", "B", "C", "D"].includes(correctAnswer)) {
				toast({
					title: "Invalid correct answer",
					description: "The correct answer must be A, B, C, or D",
					variant: "destructive",
				});
				setLoading(false);
				return;
			}

			const formDataToSubmit = new FormData();
			formDataToSubmit.append("title", formData.title);
			formDataToSubmit.append("optionA", formData.optionA);
			formDataToSubmit.append("optionB", formData.optionB);
			formDataToSubmit.append("optionC", formData.optionC);
			formDataToSubmit.append("optionD", formData.optionD);
			formDataToSubmit.append("correctAnswer", correctAnswer);
			formDataToSubmit.append("explanation", formData.explanation);
			if (formData.image) {
				formDataToSubmit.append("image", formData.image);
			}

			const questionData = {
				title: formData.title,
				optionA: formData.optionA,
				optionB: formData.optionB,
				optionC: formData.optionC,
				optionD: formData.optionD,
				correctAnswer,
				explanation: formData.explanation,
			};

			if (isEdit && question) {
				// Update the question
				await updateQuestion({
					id: question.id,
					...questionData,
				});

				// Show success message
				toast({
					title: "Question updated",
					description: "The question has been updated successfully",
				});
			} else {
				// Create the question
				await addQuestion(questionData);

				// Show success message
				toast({
					title: "Question added",
					description: "The question has been added successfully",
				});
			}

			// Reset form if not editing
			if (!isEdit) {
				setFormData({
					title: "",
					optionA: "",
					optionB: "",
					optionC: "",
					optionD: "",
					correctAnswer: "",
					explanation: "",
					image: null,
				});
				setPreviewUrl(null);
			}

			// Call the callback if provided
			if (onQuestionAdded) {
				onQuestionAdded();
			}

			// Close dialog if editing
			if (isEdit) {
				setOpen(false);
			} else {
				// Focus back on the title input after submitting
				setTimeout(() => {
					titleInputRef.current?.focus();
				}, 0);
			}
		} catch (error) {
			toast({
				title: isEdit ? "Failed to update question" : "Failed to add question",
				description: `There was an error ${isEdit ? "updating" : "adding"} the question. Please try again.`,
				variant: "destructive",
			});
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent, inputName: string) => {
		if (e.key === "Enter") {
			if (inputName === "explanation") {
				// Submit the form when Enter is pressed in the explanation field
				e.preventDefault();
				formRef.current?.requestSubmit();
			} else if (inputName !== "explanation") {
				e.preventDefault();

				// Define the input order
				const inputOrder = [
					"title",
					"optionA",
					"optionB",
					"optionC",
					"optionD",
					"correctAnswer",
					"explanation",
					"submit",
				];

				// Find the next input to focus
				const currentIndex = inputOrder.indexOf(inputName);
				const nextInput = inputOrder[currentIndex + 1];

				// Focus the next input
				if (nextInput === "submit") {
					const submitButton = document.querySelector(
						'button[type="submit"]',
					) as HTMLButtonElement;
					submitButton?.focus();
				} else {
					const nextInputElement = document.getElementById(nextInput) as
						| HTMLInputElement
						| HTMLTextAreaElement;
					nextInputElement?.focus();
				}
			}
		}
	};

	const defaultTrigger = (
		<Button>
			{isEdit ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
			{isEdit ? "Edit Question" : "Add Question"}
		</Button>
	);

	// Call the external onOpenChange handler when our internal state changes
	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (onOpenChange) {
			onOpenChange(newOpen);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<form ref={formRef} onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>
							{isEdit ? "Edit Question" : "Add New Question"}
						</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="flex flex-col items-center gap-4 mb-2">
							<div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-muted-foreground/25">
								{previewUrl ? (
									<>
										<Image
											src={previewUrl}
											alt="Question preview"
											fill
											className="object-cover"
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute top-1 right-1 h-6 w-6 bg-background/80 hover:bg-background/90"
											onClick={removeImage}
											disabled={loading}
										>
											<X className="h-4 w-4" />
										</Button>
									</>
								) : (
									<div className="w-full h-full flex items-center justify-center bg-muted/10">
										<Upload className="h-8 w-8 text-muted-foreground/50" />
									</div>
								)}
							</div>
							<Button
								type="button"
								variant="outline"
								onClick={() => fileInputRef.current?.click()}
								disabled={loading}
								className="w-fit"
							>
								<Upload className="h-4 w-4 mr-2" />
								{previewUrl ? "Change Image" : "Upload Image"}
							</Button>
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleImageChange}
								accept="image/*"
								className="hidden"
								disabled={loading}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="title">Question Title</Label>
							<Input
								id="title"
								name="title"
								placeholder="Enter your question here"
								value={formData.title}
								onChange={handleChange}
								onKeyDown={(e) => handleKeyDown(e, "title")}
								ref={titleInputRef}
								required
								disabled={loading}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="optionA">Option A</Label>
							<Input
								id="optionA"
								name="optionA"
								placeholder="Enter option A"
								value={formData.optionA}
								onChange={handleChange}
								onKeyDown={(e) => handleKeyDown(e, "optionA")}
								required
								disabled={loading}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="optionB">Option B</Label>
							<Input
								id="optionB"
								name="optionB"
								placeholder="Enter option B"
								value={formData.optionB}
								onChange={handleChange}
								onKeyDown={(e) => handleKeyDown(e, "optionB")}
								required
								disabled={loading}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="optionC">Option C</Label>
							<Input
								id="optionC"
								name="optionC"
								placeholder="Enter option C"
								value={formData.optionC}
								onChange={handleChange}
								onKeyDown={(e) => handleKeyDown(e, "optionC")}
								required
								disabled={loading}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="optionD">Option D</Label>
							<Input
								id="optionD"
								name="optionD"
								placeholder="Enter option D"
								value={formData.optionD}
								onChange={handleChange}
								onKeyDown={(e) => handleKeyDown(e, "optionD")}
								disabled={loading}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="correctAnswer">
								Correct Answer (A, B, C or D)
							</Label>
							<Input
								id="correctAnswer"
								name="correctAnswer"
								placeholder="Enter the correct answer (A, B, C or D)"
								value={formData.correctAnswer}
								onChange={handleChange}
								onKeyDown={(e) => handleKeyDown(e, "correctAnswer")}
								required
								disabled={loading}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="explanation">Explanation</Label>
							<Textarea
								id="explanation"
								name="explanation"
								placeholder="Explain why the correct answer is right"
								value={formData.explanation}
								onChange={handleChange}
								onKeyDown={(e) => handleKeyDown(e, "explanation")}
								className="min-h-[80px]"
								required
								disabled={loading}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit" disabled={loading}>
							{loading ? "Submitting..." : isEdit ? "Update" : "Submit"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

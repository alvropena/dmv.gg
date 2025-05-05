"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Step = "birthday" | "gender" | "ethnicity" | "language";

interface UserProfileDialogProps {
	isOpen: boolean;
	onSave: (data: {
		birthday: Date;
		gender: string;
		ethnicity: string;
		language: string;
	}) => Promise<void>;
	onClose: () => void;
	initialData?: {
		birthday?: Date;
		gender?: string;
		ethnicity?: string;
		language?: string;
	};
	userId?: string;
}

export function UserProfileDialog({
	isOpen,
	onSave,
	onClose,
	initialData,
	userId,
}: UserProfileDialogProps) {
	const birthdayDate = initialData?.birthday
		? new Date(initialData.birthday)
		: undefined;

	const [step, setStep] = useState<Step>(
		initialData?.birthday ? "gender" : "birthday",
	);
	const [day, setDay] = useState<string | undefined>(
		birthdayDate ? birthdayDate.getDate().toString() : undefined,
	);
	const [month, setMonth] = useState<string | undefined>(
		birthdayDate ? (birthdayDate.getMonth() + 1).toString() : undefined,
	);
	const [year, setYear] = useState<string | undefined>(
		birthdayDate ? birthdayDate.getFullYear().toString() : undefined,
	);
	const [gender, setGender] = useState<string | undefined>(initialData?.gender);
	const [ethnicity, setEthnicity] = useState<string | undefined>(
		initialData?.ethnicity,
	);
	const [language, setLanguage] = useState<string | undefined>(
		initialData?.language,
	);
	const [customGender, setCustomGender] = useState<string>("");
	const [customEthnicity, setCustomEthnicity] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Helper for localStorage key
	const dismissedKey = userId
		? `profileDialogDismissed_${userId}`
		: "profileDialogDismissed";

	// Custom onClose handler
	const handleDialogClose = () => {
		if (typeof window !== "undefined") {
			localStorage.setItem(dismissedKey, "true");
		}
		onClose();
	};

	const handleNext = async () => {
		if (step === "birthday") {
			if (!day || !month || !year) return;
			setStep("gender");
		} else if (step === "gender") {
			if (!gender) return;
			setStep("ethnicity");
		} else if (step === "ethnicity") {
			if (!ethnicity) return;
			setStep("language");
		} else if (step === "language") {
			if (!language) return;
			try {
				setIsSubmitting(true);
				if (!year || !month || !day || !gender || !ethnicity || !language) {
					throw new Error("Missing required fields");
				}
				await onSave({
					birthday: new Date(
						Number.parseInt(year),
						Number.parseInt(month) - 1,
						Number.parseInt(day),
					),
					gender: gender === "other" ? customGender : gender || "",
					ethnicity: ethnicity === "other" ? customEthnicity : ethnicity || "",
					language: language || "",
				});
				onClose();
			} catch (error) {
				console.error("Error saving profile:", error);
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	const handleBack = () => {
		if (step === "gender") setStep("birthday");
		else if (step === "ethnicity") setStep("gender");
		else if (step === "language") setStep("ethnicity");
	};

	// Generate days 1-31
	const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

	// Generate months 1-12
	const months = [
		{ value: "1", label: "January" },
		{ value: "2", label: "February" },
		{ value: "3", label: "March" },
		{ value: "4", label: "April" },
		{ value: "5", label: "May" },
		{ value: "6", label: "June" },
		{ value: "7", label: "July" },
		{ value: "8", label: "August" },
		{ value: "9", label: "September" },
		{ value: "10", label: "October" },
		{ value: "11", label: "November" },
		{ value: "12", label: "December" },
	];

	// Generate years from 1950 to current year
	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) =>
		(currentYear - i).toString(),
	);

	const genders = [
		{ value: "male", label: "Male" },
		{ value: "female", label: "Female" },
		{ value: "non-binary", label: "Non-binary" },
		{ value: "other", label: "Other" },
		{ value: "prefer-not-to-say", label: "Prefer not to say" },
	];

	const ethnicities = [
		{ value: "white", label: "White" },
		{ value: "black", label: "Black or African American" },
		{ value: "asian", label: "Asian" },
		{ value: "hispanic", label: "Hispanic or Latino" },
		{ value: "other", label: "Other" },
		{ value: "prefer-not-to-say", label: "Prefer not to say" },
	];

	const languages = [
		{ value: "en", label: "English" },
		{ value: "es", label: "Spanish" },
	];

	const isStepComplete = () => {
		switch (step) {
			case "birthday":
				return day && month && year;
			case "gender":
				return gender && (gender !== "other" || customGender.trim() !== "");
			case "ethnicity":
				return (
					ethnicity && (ethnicity !== "other" || customEthnicity.trim() !== "")
				);
			case "language":
				return language;
			default:
				return false;
		}
	};

	const getStepTitle = () => {
		switch (step) {
			case "birthday":
				return "When were you born?";
			case "gender":
				return "What is your gender?";
			case "ethnicity":
				return "What is your ethnicity?";
			case "language":
				return "What is your primary language?";
			default:
				return "";
		}
	};

	const getStepDescription = () => {
		switch (step) {
			case "birthday":
				return "Please enter your date of birth to continue.";
			case "gender":
				return "This helps us understand our user base better.";
			case "ethnicity":
				return "This helps us ensure our content is inclusive.";
			case "language":
				return "This helps us provide better support.";
			default:
				return "";
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleDialogClose}>
			<DialogContent
				className="sm:max-w-[400px] w-[90%] mx-auto rounded-md [&_.close-button]:hidden"
				onEscapeKeyDown={handleDialogClose}
				onInteractOutside={(e) => {
					e.preventDefault();
				}}
			>
				<DialogHeader>
					<DialogTitle>{getStepTitle()}</DialogTitle>
					<DialogDescription>{getStepDescription()}</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col">
					{step === "birthday" && (
						<div className="grid grid-cols-3 w-full gap-2">
							{/* Month Select */}
							<div>
								<Select value={month} onValueChange={setMonth}>
									<SelectTrigger>
										<SelectValue placeholder="Month" />
									</SelectTrigger>
									<SelectContent>
										{months.map((item) => (
											<SelectItem key={item.value} value={item.value}>
												{item.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Day Select */}
							<div>
								<Select value={day} onValueChange={setDay}>
									<SelectTrigger>
										<SelectValue placeholder="Day" />
									</SelectTrigger>
									<SelectContent>
										{days.map((day) => (
											<SelectItem key={day} value={day}>
												{day}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Year Select */}
							<div>
								<Select value={year} onValueChange={setYear}>
									<SelectTrigger>
										<SelectValue placeholder="Year" />
									</SelectTrigger>
									<SelectContent>
										{years.map((year) => (
											<SelectItem key={year} value={year}>
												{year}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					)}

					{step === "gender" && (
						<div className="flex flex-col gap-2">
							<Select value={gender} onValueChange={setGender}>
								<SelectTrigger>
									<SelectValue placeholder="Select your gender" />
								</SelectTrigger>
								<SelectContent>
									{genders.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{gender === "other" && (
								<Input
									placeholder="Please specify your gender"
									value={customGender}
									onChange={(e) => setCustomGender(e.target.value)}
								/>
							)}
						</div>
					)}

					{step === "ethnicity" && (
						<div className="flex flex-col gap-2">
							<Select value={ethnicity} onValueChange={setEthnicity}>
								<SelectTrigger>
									<SelectValue placeholder="Select your ethnicity" />
								</SelectTrigger>
								<SelectContent>
									{ethnicities.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{ethnicity === "other" && (
								<Input
									placeholder="Please specify your ethnicity"
									value={customEthnicity}
									onChange={(e) => setCustomEthnicity(e.target.value)}
								/>
							)}
						</div>
					)}

					{step === "language" && (
						<Select value={language} onValueChange={setLanguage}>
							<SelectTrigger>
								<SelectValue placeholder="Select your primary language" />
							</SelectTrigger>
							<SelectContent>
								{languages.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</div>
				<DialogFooter className="flex gap-2">
					{step !== "birthday" && (
						<Button
							variant="outline"
							onClick={handleBack}
							disabled={isSubmitting}
						>
							Back
						</Button>
					)}
					<Button
						onClick={handleNext}
						disabled={!isStepComplete() || isSubmitting}
						className="flex-1"
					>
						{isSubmitting ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : step === "language" ? (
							"Complete"
						) : (
							"Continue"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

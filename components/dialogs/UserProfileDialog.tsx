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
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

type Step = "name" | "birthday" | "gender" | "ethnicity" | "language" | "startTest";

interface UserProfileDialogProps {
	isOpen: boolean;
	onSave: (data: {
		firstName: string;
		lastName: string;
		birthday: Date;
		gender: string;
		ethnicity: string;
		language: string;
	}) => Promise<void>;
	onClose: () => void;
	initialData?: {
		firstName?: string;
		lastName?: string;
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
	const router = useRouter();

	const parseBirthday = (birthday: unknown) => {
		if (!birthday) return { day: undefined, month: undefined, year: undefined };
		if (typeof birthday === "string") {
			const match = birthday.match(/^(\d{4})-(\d{2})-(\d{2})/);
			if (match) {
				return {
					year: match[1],
					month: String(Number(match[2])), // remove leading zero
					day: String(Number(match[3])),
				};
			}
		}
		if (birthday instanceof Date && !Number.isNaN(birthday.getTime())) {
			return {
				day: birthday.getDate().toString(),
				month: (birthday.getMonth() + 1).toString(),
				year: birthday.getFullYear().toString(),
			};
		}
		return { day: undefined, month: undefined, year: undefined };
	};

	const {
		day: initialDay,
		month: initialMonth,
		year: initialYear,
	} = parseBirthday(initialData?.birthday);

	const [step, setStep] = useState<Step>(
		initialData?.firstName && initialData?.lastName
			? initialData?.birthday
				? initialData?.gender && initialData?.ethnicity && initialData?.language
					? "startTest"
					: "gender"
				: "birthday"
			: "name"
	);
	const [firstName, setFirstName] = useState<string>(initialData?.firstName || "");
	const [lastName, setLastName] = useState<string>(initialData?.lastName || "");
	const [day, setDay] = useState<string | undefined>(initialDay);
	const [month, setMonth] = useState<string | undefined>(initialMonth);
	const [year, setYear] = useState<string | undefined>(initialYear);
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
		if (step === "name") {
			if (!firstName.trim() || !lastName.trim()) return;
			setStep("birthday");
		} else if (step === "birthday") {
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
			setStep("startTest");
		} else if (step === "startTest") {
			try {
				setIsSubmitting(true);
				if (!firstName.trim() || !lastName.trim() || !year || !month || !day || !gender || !ethnicity || !language) {
					throw new Error("Missing required fields");
				}
				await onSave({
					firstName: firstName.trim(),
					lastName: lastName.trim(),
					birthday: new Date(
						Number.parseInt(year),
						Number.parseInt(month) - 1,
						Number.parseInt(day),
					),
					gender: gender === "other" ? customGender : gender || "",
					ethnicity: ethnicity === "other" ? customEthnicity : ethnicity || "",
					language: language || "",
				});

				// Create a new test and navigate to it
				const response = await fetch("/api/tests", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ type: "NEW" }),
				});
				if (!response.ok) {
					throw new Error("Failed to create test");
				}
				const data = await response.json();
				if (data?.test?.id) {
					router.push(`/test/${data.test.id}`);
				} else {
					throw new Error("No test ID received from server");
				}
			} catch (error) {
				console.error("Error saving profile or creating test:", error);
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	const handleBack = () => {
		if (step === "birthday") setStep("name");
		else if (step === "gender") setStep("birthday");
		else if (step === "ethnicity") setStep("gender");
		else if (step === "language") setStep("ethnicity");
		else if (step === "startTest") setStep("language");
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
			case "name":
				return firstName.trim() && lastName.trim();
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
			case "startTest":
				return true;
			default:
				return false;
		}
	};

	const getStepTitle = () => {
		switch (step) {
			case "name":
				return "What's your name?";
			case "birthday":
				return "When were you born?";
			case "gender":
				return "What is your gender?";
			case "ethnicity":
				return "What is your ethnicity?";
			case "language":
				return "What is your primary language?";
			case "startTest":
				return "You're ready! Take your free DMV practice test";
			default:
				return "";
		}
	};

	const getStepDescription = () => {
		switch (step) {
			case "name":
				return "Please enter your first and last name.";
			case "birthday":
				return "Please enter your date of birth to continue.";
			case "gender":
				return "This helps us understand our user base better.";
			case "ethnicity":
				return "This helps us ensure our content is inclusive.";
			case "language":
				return "This helps us provide better support.";
			case "startTest":
				return "Click below to begin your free DMV-style practice test.";
			default:
				return "";
		}
	};

	const steps: Step[] = ["name", "birthday", "gender", "ethnicity", "language", "startTest"];
	const currentStepIndex = steps.indexOf(step);
	const progressValue = ((currentStepIndex + 1) / steps.length) * 100;

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
					{/* Progress bar at the top of the header, hidden on startTest step */}
					{step !== "startTest" && (
						<div className="mt-6 mb-4">
							<div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
								<div
									className="h-full bg-blue-600 transition-all duration-500 rounded-full"
									style={{ width: `${progressValue}%` }}
								/>
							</div>
						</div>
					)}
					{step === "startTest" && (
						<div className="flex justify-center mb-2">
							<svg
								width="64"
								height="64"
								viewBox="0 0 64 64"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="mb-2"
							>
								<circle cx="32" cy="32" r="32" fill="#22c55e" />
								<path
									d="M20 34L29 43L44 26"
									stroke="white"
									strokeWidth="4"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
					)}
					<DialogTitle>{getStepTitle()}</DialogTitle>
					<DialogDescription>{getStepDescription()}</DialogDescription>
				</DialogHeader>
				{step !== "startTest" && (
				<div className="flex flex-col">
					{step === "name" && (
						<div className="grid grid-cols-2 gap-2">
							<Input
								placeholder="First name"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>
							<Input
								placeholder="Last name"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</div>
					)}

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
					)}
				<DialogFooter className="flex gap-2">
					{step !== "name" && (
						<Button
							variant="outline"
							onClick={handleBack}
							disabled={isSubmitting}
						>
							Go back
						</Button>
					)}
					{step === "startTest" ? (
						<Button
							onClick={handleNext}
							disabled={isSubmitting}
						>
							{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start 36-question free test"}
						</Button>
					) : (
						<Button
							onClick={handleNext}
							disabled={!isStepComplete() || isSubmitting}
						>
							{isSubmitting ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : step === "language" ? (
								"Continue"
							) : (
								"Continue"
							)}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

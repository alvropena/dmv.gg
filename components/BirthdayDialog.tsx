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

interface BirthdayDialogProps {
	isOpen: boolean;
	onSave: (birthday: Date) => Promise<void>;
}

export function BirthdayDialog({ isOpen, onSave }: BirthdayDialogProps) {
	const [day, setDay] = useState<string | undefined>(undefined);
	const [month, setMonth] = useState<string | undefined>(undefined);
	const [year, setYear] = useState<string | undefined>(undefined);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSave = async () => {
		if (!day || !month || !year) return;

		try {
			setIsSubmitting(true);
			// Convert selections to a Date object
			// Note: month is 0-indexed in JavaScript Date
			const date = new Date(
				parseInt(year),
				parseInt(month) - 1,
				parseInt(day)
			);
			await onSave(date);
		} catch (error) {
			console.error("Error saving birthday:", error);
		} finally {
			setIsSubmitting(false);
		}
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
	const years = Array.from(
		{ length: currentYear - 1950 + 1 },
		(_, i) => (currentYear - i).toString()
	);

	const isSelectionComplete = day && month && year;

	return (
		<Dialog open={isOpen}>
			<DialogContent 
				className="sm:max-w-[400px] w-[90%] mx-auto rounded-md" 
				showCloseButton={false}
				onPointerDownOutside={(e) => e.preventDefault()}
				onFocusOutside={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>Complete your profile</DialogTitle>
					<DialogDescription>
						Please enter your date of birth to continue.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col">
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
				</div>
				<DialogFooter>
					<Button
						onClick={handleSave}
						disabled={!isSelectionComplete || isSubmitting}
						className="w-full sm:w-auto"
					>
						{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

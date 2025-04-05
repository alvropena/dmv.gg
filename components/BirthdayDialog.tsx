"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface BirthdayDialogProps {
	isOpen: boolean;
	onSave: (birthday: Date) => Promise<void>;
}

export function BirthdayDialog({ isOpen, onSave }: BirthdayDialogProps) {
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSave = async () => {
		if (!date) return;

		try {
			setIsSubmitting(true);
			await onSave(date);
		} catch (error) {
			console.error("Error saving birthday:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Calculate the maximum date (18 years ago from today)
	const maxDate = new Date();
	maxDate.setFullYear(maxDate.getFullYear() - 18);

	return (
		<Dialog open={isOpen}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Complete your profile</DialogTitle>
					<DialogDescription>
						Please enter your date of birth to continue. You must be at least 18
						years old.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col items-center py-4">
					<div className="grid w-full max-w-sm items-center gap-2">
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"w-full justify-start text-left font-normal",
										!date && "text-muted-foreground",
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{date ? format(date, "PPP") : "Select your birthday"}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={date}
									onSelect={setDate}
									initialFocus
									fromYear={1920}
									toDate={maxDate}
								/>
							</PopoverContent>
						</Popover>
					</div>
				</div>
				<DialogFooter>
					<Button
						onClick={handleSave}
						disabled={!date || isSubmitting}
						className="w-full sm:w-auto"
					>
						{isSubmitting ? "Saving..." : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

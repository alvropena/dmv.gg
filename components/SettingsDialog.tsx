import type React from "react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	months: { value: string; label: string }[];
	days: string[];
	years: string[];
	settingsDay: string | undefined;
	setSettingsDay: (v: string) => void;
	settingsMonth: string | undefined;
	setSettingsMonth: (v: string) => void;
	settingsYear: string | undefined;
	setSettingsYear: (v: string) => void;
	gender: string | undefined;
	setGender: (v: string) => void;
	ethnicity: string | undefined;
	setEthnicity: (v: string) => void;
	language: string | undefined;
	setLanguage: (v: string) => void;
}

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

const SettingsDialog: React.FC<SettingsDialogProps> = ({
	open,
	onOpenChange,
	months,
	days,
	years,
	settingsDay,
	setSettingsDay,
	settingsMonth,
	setSettingsMonth,
	settingsYear,
	setSettingsYear,
	gender,
	setGender,
	ethnicity,
	setEthnicity,
	language,
	setLanguage,
}) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className="sm:max-w-[400px] w-[90%] mx-auto rounded-md">
			<DialogHeader>
				<DialogTitle>Settings</DialogTitle>
			</DialogHeader>
			<form className="flex flex-col gap-4">
				<div>
					<Label>Birthday</Label>
					<div className="grid grid-cols-3 w-full gap-2">
						<Select value={settingsMonth} onValueChange={setSettingsMonth}>
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
						<Select value={settingsDay} onValueChange={setSettingsDay}>
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
						<Select value={settingsYear} onValueChange={setSettingsYear}>
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
				<div>
					<Label>Gender</Label>
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
				</div>
				<div>
					<Label>Ethnicity</Label>
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
				</div>
				<div>
					<Label>Language</Label>
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
				</div>
			</form>
			<DialogFooter>
				<Button
					variant="outline"
					onClick={() => onOpenChange(false)}
					type="button"
				>
					Cancel
				</Button>
				<Button type="submit">Save</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);

export default SettingsDialog;

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
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

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
	{ value: "es", label: "Español" },
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
}) => {
	const { dbUser } = useAuthContext();

	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");

	useEffect(() => {
		if (open && dbUser) {
			if (dbUser.firstName) setFirstName(dbUser.firstName);
			if (dbUser.lastName) setLastName(dbUser.lastName);
			if (dbUser.gender) setGender(dbUser.gender);
			if (dbUser.ethnicity) setEthnicity(dbUser.ethnicity);
			if (dbUser.language) setLanguage(dbUser.language);
		}
	}, [open, dbUser, setGender, setEthnicity, setLanguage]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[400px] w-[90%] mx-auto rounded-md">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
				</DialogHeader>
				<form className="flex flex-col gap-4">
					<div className="grid grid-cols-2 gap-2">
						<div>
							<Label>First Name</Label>
							<input
								type="text"
								className="w-full border rounded px-2 py-1"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>
						</div>
						<div>
							<Label>Last Name</Label>
							<input
								type="text"
								className="w-full border rounded px-2 py-1"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</div>
					</div>
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
				<DialogFooter className="flex flex-col gap-2">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						type="button"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						onClick={async () => {
							if (
								!firstName.trim() ||
								!lastName.trim() ||
								!settingsDay ||
								!settingsMonth ||
								!settingsYear ||
								!gender ||
								!ethnicity ||
								!language
							) {
								return;
							}
							try {
								const response = await fetch("/api/user/profile", {
									method: "PUT",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify({
										firstName: firstName.trim(),
										lastName: lastName.trim(),
										birthday: new Date(
											Number.parseInt(settingsYear),
											Number.parseInt(settingsMonth) - 1,
											Number.parseInt(settingsDay),
										),
										gender,
										ethnicity,
										language,
									}),
								});

								if (response.ok) {
									onOpenChange(false);
								}
							} catch (error) {
								console.error("Error saving settings:", error);
							}
						}}
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default SettingsDialog;

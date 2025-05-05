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
}

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
				{/* Gender, Ethnicity, Language fields can be added here as needed */}
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

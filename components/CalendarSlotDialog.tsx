"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface CalendarSlotDialogProps {
	dateObj: Date;
	startTime: number;
	endTime: number;
	children: React.ReactNode;
}

export function CalendarSlotDialog({
	dateObj,
	startTime,
	endTime,
	children,
}: CalendarSlotDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [platform, setPlatform] = useState("");
	const [allDay, setAllDay] = useState(false);
	const [repeat, setRepeat] = useState("none");
	const [selectedDate, setSelectedDate] = useState<Date>(dateObj);
	const [selectedStart, setSelectedStart] = useState(startTime);
	const [selectedEnd, setSelectedEnd] = useState(endTime);
	const [datePopoverOpen, setDatePopoverOpen] = useState(false);

	const formatTime = (hour: number, min: number) => {
		const total = hour * 60 + min;
		const h = Math.floor(total / 60) % 24;
		const m = total % 60;
		const ampm = h >= 12 ? "pm" : "am";
		const displayHour = h % 12 === 0 ? 12 : h % 12;
		return `${displayHour}:${m.toString().padStart(2, "0")}${ampm}`;
	};

	// Generate 15-min interval options
	const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
		const hour = Math.floor(i / 4);
		const min = (i % 4) * 15;
		return {
			value: hour * 60 + min,
			label: formatTime(hour, min),
		};
	});

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					className="w-full h-full hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
				>
					{children}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{selectedDate.toLocaleDateString(undefined, {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</DialogTitle>
				</DialogHeader>
				<div className="flex items-center gap-2 mb-2">
					<Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								type="button"
								className="px-3 py-1 text-sm font-normal min-w-[140px]"
							>
								{selectedDate.toLocaleDateString(undefined, {
									weekday: "long",
									month: "short",
									day: "numeric",
								})}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								mode="single"
								selected={selectedDate}
								onSelect={(date) => {
									if (date) {
										setSelectedDate(date);
										setDatePopoverOpen(false);
									}
								}}
							/>
						</PopoverContent>
					</Popover>
					<Select
						value={String(selectedStart)}
						onValueChange={(v) => setSelectedStart(Number(v))}
					>
						<SelectTrigger className="w-28 rounded-full">
							<SelectValue placeholder="Start time" />
						</SelectTrigger>
						<SelectContent>
							{timeOptions.map((opt) => (
								<SelectItem key={opt.value} value={String(opt.value)}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<span className="text-lg">-</span>
					<Select
						value={String(selectedEnd)}
						onValueChange={(v) => setSelectedEnd(Number(v))}
					>
						<SelectTrigger className="w-28 rounded-full">
							<SelectValue placeholder="End time" />
						</SelectTrigger>
						<SelectContent>
							{timeOptions.map((opt) => (
								<SelectItem key={opt.value} value={String(opt.value)}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center gap-4 mb-2">
					<Checkbox
						id="all-day"
						checked={allDay}
						onCheckedChange={(checked) =>
							setAllDay(checked === "indeterminate" ? false : checked)
						}
					/>
					<Label htmlFor="all-day" className="cursor-pointer">
						All day
					</Label>
				</div>
				<div className="mb-2">
					<Select value={repeat} onValueChange={setRepeat}>
						<SelectTrigger className="rounded-full">
							<SelectValue placeholder="Does not repeat" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="none">Does not repeat</SelectItem>
							<SelectItem value="daily">Daily</SelectItem>
							<SelectItem value="weekly">Weekly</SelectItem>
							<SelectItem value="monthly">Monthly</SelectItem>
							<SelectItem value="yearly">Annually</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Label htmlFor="platform-select">Platform</Label>
				<Select value={platform} onValueChange={setPlatform}>
					<SelectTrigger className="rounded-full">
						<SelectValue placeholder="Select platform" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="instagram">Instagram</SelectItem>
						<SelectItem value="facebook">Facebook</SelectItem>
						<SelectItem value="twitter">Twitter</SelectItem>
						<SelectItem value="tiktok">TikTok</SelectItem>
						<SelectItem value="linkedin">LinkedIn</SelectItem>
					</SelectContent>
				</Select>
				<div className="flex justify-end">
					<Button type="button">Save</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

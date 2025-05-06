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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CalendarSlotDialogProps {
	dateObj: Date;
	startTime: number;
	endTime: number;
	children: React.ReactNode;
	onSave?: (event: {
		title: string;
		date: string;
		startTime: number;
		endTime: number;
		platform?: string;
		allDay?: boolean;
		repeat?: string;
	}) => void;
}

// Mock creators data
const MOCK_CREATORS = [
	{ id: "1", name: "Alex Johnson", email: "alex@email.com" },
	{ id: "2", name: "Sam Lee", email: "sam@email.com" },
	{ id: "3", name: "Priya Sharma", email: "priya@email.com" },
	{ id: "4", name: "Jordan Taylor", email: "jordan@email.com" },
];

export function CalendarSlotDialog({
	dateObj,
	startTime,
	endTime,
	children,
	onSave,
}: CalendarSlotDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [platform, setPlatform] = useState("");
	const [allDay, setAllDay] = useState(false);
	const [repeat, setRepeat] = useState("none");
	const [selectedDate, setSelectedDate] = useState<Date>(dateObj);
	const [selectedStart, setSelectedStart] = useState(startTime);
	const [selectedEnd, setSelectedEnd] = useState(endTime);
	const [datePopoverOpen, setDatePopoverOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [creatorFilter, setCreatorFilter] = useState("");
	const [selectedCreators, setSelectedCreators] = useState<string[]>([]);

	const formatTime = (total: number) => {
		const h = Math.floor(total / 60) % 24;
		const m = total % 60;
		const ampm = h >= 12 ? "pm" : "am";
		const displayHour = h % 12 === 0 ? 12 : h % 12;
		return `${displayHour}:${m.toString().padStart(2, "0")}${ampm}`;
	};

	// Generate 15-min interval options
	const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
		const total = i * 15;
		return {
			value: total,
			label: formatTime(total),
		};
	});

	const filteredCreators = MOCK_CREATORS.filter(
		(c) =>
			c.name.toLowerCase().includes(creatorFilter.toLowerCase()) ||
			c.email.toLowerCase().includes(creatorFilter.toLowerCase()),
	);

	function toggleCreator(id: string) {
		setSelectedCreators((prev) =>
			prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
		);
	}

	function removeCreator(id: string) {
		setSelectedCreators((prev) => prev.filter((cid) => cid !== id));
	}

	const handleSave = () => {
		if (!title.trim()) {
			toast.error("Title is required");
			return;
		}
		if (onSave) {
			onSave({
				title,
				date: selectedDate.toISOString().split("T")[0],
				startTime: selectedStart,
				endTime: selectedEnd,
				platform,
				allDay,
				repeat,
			});
		}
		toast.success("Event saved!");
		setIsOpen(false);
	};

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
				<div className="mb-2">
					<Label htmlFor="event-title">Title</Label>
					<Input
						id="event-title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Add title"
						className="mt-1"
					/>
				</div>
				<div className="mb-2">
					<Label htmlFor="creator-select">Creator</Label>
					<div className="flex flex-wrap gap-2 mb-2">
						{selectedCreators.map((cid) => {
							const creator = MOCK_CREATORS.find((c) => c.id === cid);
							if (!creator) return null;
							return (
								<span
									key={cid}
									className="inline-flex items-center px-2 py-1 rounded bg-accent text-xs"
								>
									{creator.name}{" "}
									<span className="ml-1 text-muted-foreground">
										({creator.email})
									</span>
									<button
										type="button"
										className="ml-1 text-red-500"
										onClick={() => removeCreator(cid)}
									>
										&times;
									</button>
								</span>
							);
						})}
					</div>
					<Input
						id="creator-select"
						placeholder="Type to search creators..."
						value={creatorFilter}
						onChange={(e) => setCreatorFilter(e.target.value)}
						className="mb-2"
					/>
					<div className="max-h-32 overflow-y-auto border rounded bg-background">
						{filteredCreators.length === 0 && (
							<div className="p-2 text-xs text-muted-foreground">
								No creators found
							</div>
						)}
						{filteredCreators.map((creator) => (
							<button
								type="button"
								key={creator.id}
								onClick={() => toggleCreator(creator.id)}
								className={`w-full text-left px-3 py-2 text-sm hover:bg-accent ${selectedCreators.includes(creator.id) ? "bg-accent/70" : ""}`}
							>
								{creator.name}{" "}
								<span className="text-muted-foreground">({creator.email})</span>
							</button>
						))}
					</div>
				</div>
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
					<Button type="button" onClick={handleSave}>
						Save
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

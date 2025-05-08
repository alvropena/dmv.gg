"use client";

import { useState, useEffect } from "react";
import { ListCheck, Calendar, Archive } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import type { Reminder } from "@/types";

export function AdminRemindersDropdown() {
	const [reminders, setReminders] = useState<Reminder[]>([]);
	const [newReminder, setNewReminder] = useState("");
	const [dueDate, setDueDate] = useState<Date>();

	useEffect(() => {
		fetchReminders();
	}, []);

	const fetchReminders = async () => {
		try {
			const response = await fetch("/api/reminders");
			const data = await response.json();
			setReminders(data);
		} catch (error) {
			console.error("Error fetching reminders:", error);
		}
	};

	const handleCheck = async (id: string) => {
		try {
			const response = await fetch(`/api/reminders/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					completed: !reminders.find((r) => r.id === id)?.completed,
				}),
			});

			if (response.ok) {
				setReminders(
					reminders.map((reminder) =>
						reminder.id === id
							? { ...reminder, completed: !reminder.completed }
							: reminder,
					),
				);
			}
		} catch (error) {
			console.error("Error updating reminder:", error);
		}
	};

	const handleEdit = async (id: string, value: string) => {
		try {
			const response = await fetch(`/api/reminders/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					text: value,
				}),
			});

			if (response.ok) {
				fetchReminders();
			}
		} catch (error) {
			console.error("Error updating reminder:", error);
		}
	};

	const handleArchive = async (id: string) => {
		try {
			const response = await fetch(`/api/reminders/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					archived: true,
				}),
			});

			if (response.ok) {
				fetchReminders();
			}
		} catch (error) {
			console.error("Error archiving reminder:", error);
		}
	};

	const handleAdd = async () => {
		if (newReminder.trim() === "") return;

		try {
			const response = await fetch("/api/reminders", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					text: newReminder,
					dueDate: dueDate,
				}),
			});

			if (response.ok) {
				setNewReminder("");
				setDueDate(undefined);
				fetchReminders();
			}
		} catch (error) {
			console.error("Error creating reminder:", error);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Notes and Reminders"
					type="button"
				>
					<ListCheck className="h-[1.2rem] w-[1.2rem]" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80">
				<DropdownMenuLabel>Reminders</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<div className="max-h-80 overflow-auto">
					{reminders.length > 0 && (
						<>
							{reminders.map((reminder) => (
								<DropdownMenuItem
									key={reminder.id}
									className="flex items-center gap-2"
								>
									<Checkbox
										checked={reminder.completed}
										onCheckedChange={() => handleCheck(reminder.id)}
										className="mr-2"
									/>
									<div className="flex-1">
										<Input
											value={reminder.text}
											onChange={(e) => handleEdit(reminder.id, e.target.value)}
											className={`bg-transparent border-none p-0 text-sm ${reminder.completed ? "line-through text-muted-foreground" : ""}`}
											disabled={reminder.completed}
										/>
										{reminder.dueDate && (
											<p className="text-xs text-muted-foreground mt-1">
												Due:{" "}
												{format(
													new Date(reminder.dueDate),
													"MMM d, yyyy h:mm a",
												)}
											</p>
										)}
									</div>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 opacity-50 hover:opacity-100"
										onClick={(e) => {
											e.stopPropagation();
											handleArchive(reminder.id);
										}}
									>
										<Archive className="h-4 w-4" />
										<span className="sr-only">Archive reminder</span>
									</Button>
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
						</>
					)}
					<div className="flex items-center gap-2 px-2 py-2">
						<Checkbox checked={false} disabled className="mr-2 opacity-50" />
						<Input
							value={newReminder}
							onChange={(e) => setNewReminder(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleAdd();
							}}
							placeholder="Add new reminder..."
							className="flex-1 bg-transparent border-none p-0 text-sm"
						/>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									size="sm"
									variant="ghost"
									type="button"
									className="h-8 w-8 p-0"
								>
									<Calendar className="h-4 w-4" />
									<span className="sr-only">Set due date</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="end">
								<CalendarComponent
									mode="single"
									selected={dueDate}
									onSelect={setDueDate}
									initialFocus
								/>
								<div className="p-3 border-t">
									<Input
										type="time"
										value={dueDate ? format(dueDate, "HH:mm") : ""}
										onChange={(e) => {
											if (dueDate) {
												const [hours, minutes] = e.target.value.split(":");
												const newDate = new Date(dueDate);
												newDate.setHours(
													Number.parseInt(hours),
													Number.parseInt(minutes),
												);
												setDueDate(newDate);
											}
										}}
										className="w-full"
									/>
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="justify-center font-medium cursor-pointer">
					View all reminders
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

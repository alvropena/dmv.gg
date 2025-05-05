"use client";

import React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarSlotDialog } from "./CalendarSlotDialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Event types with different colors
type EventType =
	| "class"
	| "flight"
	| "ops"
	| "concert"
	| "holiday"
	| "sideshift";

interface CalendarEvent {
	id: string;
	title: string;
	day: number; // 0-6 (Sunday to Saturday)
	startTime: number; // Hours in 24-hour format (7 = 7am, 13 = 1pm)
	endTime: number; // Hours in 24-hour format
	type: EventType;
	location?: string;
	description?: string;
}

export default function WeeklyCalendar() {
	const [currentDate, setCurrentDate] = useState(new Date());

	// Get the start of the current week (Sunday)
	const getWeekStart = (date: Date) => {
		const start = new Date(date);
		start.setDate(date.getDate() - date.getDay());
		return start;
	};

	// Generate week dates
	const generateWeekDates = (startDate: Date) => {
		return Array.from({ length: 7 }, (_, i) => {
			const date = new Date(startDate);
			date.setDate(startDate.getDate() + i);
			return {
				day: date
					.toLocaleDateString("en-US", { weekday: "short" })
					.toUpperCase(),
				date: date.getDate(),
				isToday: date.toDateString() === new Date().toDateString(),
			};
		});
	};

	const currentWeek = generateWeekDates(getWeekStart(currentDate));

	// Time slots from 7am to 11pm
	const timeSlots = Array.from({ length: 17 }, (_, i) => i + 7);

	// Sample events data
	const events: CalendarEvent[] = [];

	// Get events for a specific day and time
	const getEventsForCell = (day: number, time: number) => {
		return events.filter(
			(event) => event.day === day && event.startTime === time,
		);
	};

	// Navigate to previous week
	const goToPreviousWeek = () => {
		const newDate = new Date(currentDate);
		newDate.setDate(currentDate.getDate() - 7);
		setCurrentDate(newDate);
	};

	// Navigate to next week
	const goToNextWeek = () => {
		const newDate = new Date(currentDate);
		newDate.setDate(currentDate.getDate() + 7);
		setCurrentDate(newDate);
	};

	return (
		<div className="w-full max-w-7xl overflow-auto">
			<div className="flex items-center gap-2 mb-4">
				<Button variant="outline" onClick={() => setCurrentDate(new Date())}>
					Today
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={goToPreviousWeek}
					className="rounded-full"
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={goToNextWeek}
					className="rounded-full"
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
				<span className="text-xl font-light">
					{currentDate.toLocaleString("default", { month: "long" })}{" "}
					{currentDate.getFullYear()}
				</span>
			</div>
			<div className="min-w-[800px]">
				{/* Header with days */}
				<div className="grid grid-cols-[80px_repeat(7,1fr)]">
					<div className="p-2 text-sm text-muted-foreground">GMT-07</div>
					{currentWeek.map((day) => (
						<div
							key={`${day.day}-${day.date}`}
							className="flex flex-col items-center justify-center p-2"
						>
							<div className="text-sm text-muted-foreground">{day.day}</div>
							<div
								className={cn(
									"flex items-center justify-center w-10 h-10 rounded-full text-xl font-medium",
									day.isToday ? "bg-[#000099]/90 text-white" : "",
								)}
							>
								{day.date}
							</div>
						</div>
					))}
				</div>

				{/* Calendar grid */}
				<div className="grid grid-cols-[80px_repeat(7,1fr)] border-t border-input">
					{/* Time slots */}
					{timeSlots.map((time) => (
						<React.Fragment key={time}>
							<div className="border-b border-r border-input p-1 text-right pr-2">
								<span className="text-xs text-gray-400">
									{time === 12
										? "12 PM"
										: time < 12
											? `${time} AM`
											: `${time - 12} PM`}
								</span>
							</div>

							{/* Day cells */}
							{Array.from({ length: 7 }).map((_, dayIndex) => (
								<div
									key={`${time}-${dayIndex}-${currentWeek[dayIndex].date}`}
									className="border-b border-r border-input h-12 relative"
								>
									<CalendarSlotDialog
										dateObj={
											new Date(
												currentDate.getFullYear(),
												currentDate.getMonth(),
												currentWeek[dayIndex].date,
											)
										}
										startTime={time}
										endTime={time + 1}
									>
										{getEventsForCell(dayIndex, time).map((event) => (
											<div
												key={event.id}
												className="absolute left-0 right-0 mx-0.5 p-1 rounded-sm text-xs overflow-hidden"
											>
												<div className="font-medium">{event.title}</div>
												{event.description && (
													<div className="text-xs mt-0.5 opacity-90">
														{event.description.split("\n").map((line, i) => (
															<div key={`${event.id}-${i}`}>{line}</div>
														))}
													</div>
												)}
											</div>
										))}
									</CalendarSlotDialog>
								</div>
							))}
						</React.Fragment>
					))}
				</div>
			</div>
		</div>
	);
}

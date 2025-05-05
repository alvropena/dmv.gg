import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

interface EventDetailsPopoverProps {
	event: {
		title: string;
		date: string;
		startTime: number;
		endTime: number;
		repeat?: string;
		location?: string;
		reminder?: string;
		organizer?: { name: string; avatarUrl?: string };
		platform?: string;
	};
	open: boolean;
	onOpenChange: (open: boolean) => void;
	anchorEl: React.ReactNode;
	onEdit?: () => void;
	onDelete?: () => void;
}

function formatTimeRange(start: number, end: number) {
	const toStr = (min: number) => {
		const h = Math.floor(min / 60) % 24;
		const m = min % 60;
		const ampm = h >= 12 ? "am" : "am";
		const displayHour = h % 12 === 0 ? 12 : h % 12;
		return `${displayHour}:${m.toString().padStart(2, "0")}${h >= 12 ? "pm" : "am"}`;
	};
	return `${toStr(start)} – ${toStr(end)}`;
}

export function EventDetailsPopover({
	event,
	open,
	onOpenChange,
	anchorEl,
	onEdit,
	onDelete,
}: EventDetailsPopoverProps) {
	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>{anchorEl}</PopoverTrigger>
			<PopoverContent align="center" className="w-96 p-0">
				<div className="p-4">
					<div className="flex justify-between items-start mb-2">
						<div className="flex items-center gap-2">
							<span className="inline-block w-3 h-3 rounded bg-green-500 mr-2" />
							<span className="text-xl font-bold leading-tight">
								{event.title}
							</span>
						</div>
						<div className="flex gap-2">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={onEdit}
							>
								<Pencil size={18} />
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={onDelete}
							>
								<Trash2 size={18} />
							</Button>
						</div>
					</div>
					{event.platform && (
						<div className="text-xs text-muted-foreground mb-1">
							{event.platform === "instagram"
								? "Instagram"
								: event.platform === "facebook"
									? "Facebook"
									: event.platform === "twitter"
										? "Twitter"
										: event.platform === "tiktok"
											? "TikTok"
											: event.platform === "linkedin"
												? "LinkedIn"
												: event.platform}
						</div>
					)}
					<div className="text-sm text-muted-foreground mb-1">
						{new Date(event.date).toLocaleDateString(undefined, {
							weekday: "long",
							month: "long",
							day: "numeric",
						})}
						{" • "}
						{formatTimeRange(event.startTime, event.endTime)}
					</div>
					{event.repeat && event.repeat !== "none" && (
						<div className="text-xs text-muted-foreground mb-1">
							Weekly on{" "}
							{new Date(event.date).toLocaleDateString(undefined, {
								weekday: "long",
							})}
							, repeats {event.repeat}
						</div>
					)}
					{event.location && (
						<div className="flex items-center gap-2 text-sm mb-1">
							<span className="material-symbols-outlined text-base">
								location_on
							</span>
							<span>{event.location}</span>
						</div>
					)}
					{event.reminder && (
						<div className="flex items-center gap-2 text-sm mb-1">
							<span className="material-symbols-outlined text-base">alarm</span>
							<span>{event.reminder}</span>
						</div>
					)}
					{event.organizer && (
						<div className="flex items-center gap-2 text-sm mt-2">
							<Avatar className="h-6 w-6">
								{event.organizer.avatarUrl ? (
									<AvatarImage
										src={event.organizer.avatarUrl}
										alt={event.organizer.name}
									/>
								) : (
									<AvatarFallback>{event.organizer.name[0]}</AvatarFallback>
								)}
							</Avatar>
							<span>{event.organizer.name}</span>
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}

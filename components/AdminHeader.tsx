"use client";

import { Search, MessageSquare, StickyNote } from "lucide-react";
import { AdminNotificationsButton } from "@/components/AdminNotificationsButton";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { AdminRemindersDropdown } from "@/components/AdminRemindersDropdown";
import { useState } from "react";
import { AdminSidebarNotes } from "@/components/AdminSidebarNotes";

export function AdminHeader() {
	const [showNotes, setShowNotes] = useState(false);

	return (
		<>
			<header className="sticky top-0 z-10 border-b bg-white dark:bg-gray-950 dark:border-gray-800">
				<div className="flex h-16 items-center justify-between px-6">
					<div className="flex-1">
						<div className="relative" style={{ marginLeft: "16rem" }}>
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search..."
								className="w-96 pl-8"
							/>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<AdminNotificationsButton />
						<Button
							variant="ghost"
							size="icon"
							aria-label="Open Chat Sidebar"
							type="button"
						>
							<MessageSquare className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
						</Button>
						<AdminRemindersDropdown />
						<Button
							variant="ghost"
							size="icon"
							aria-label="Notes"
							type="button"
							onClick={() => setShowNotes(!showNotes)}
						>
							<StickyNote className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
						</Button>
					</div>
				</div>
			</header>
			{showNotes && (
				<div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80">
					<AdminSidebarNotes />
				</div>
			)}
		</>
	);
}

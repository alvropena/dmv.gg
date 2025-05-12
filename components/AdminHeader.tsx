"use client";

import { Search } from "lucide-react";
import { AdminNotificationsButton } from "@/components/admin/AdminNotificationsButton";
import { Input } from "@/components/ui/input";
import { AdminRemindersDropdown } from "@/components/admin/AdminRemindersDropdown";
import { AdminChatButton } from "@/components/admin/AdminChatButton";
import { AdminNotesButton } from "@/components/admin/AdminNotesButton";

export function AdminHeader() {
	return (
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
					<AdminChatButton />
					<AdminRemindersDropdown />
					<AdminNotesButton />
				</div>
			</div>
		</header>
	);
}

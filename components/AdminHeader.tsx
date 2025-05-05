"use client";

import { Search } from "lucide-react";
import { AdminNotificationsButton } from "@/components/AdminNotificationsButton";
import { AdminAvatar } from "@/components/AdminAvatar";
import { Input } from "@/components/ui/input";
import { TimeHorizonDropdown } from "@/components/TimeHorizonDropdown";

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
					<TimeHorizonDropdown />
					<AdminNotificationsButton />
					<AdminAvatar />
				</div>
			</div>
		</header>
	);
}

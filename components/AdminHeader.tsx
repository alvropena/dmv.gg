"use client";

import { Search, MessageSquare } from "lucide-react";
import { AdminNotificationsButton } from "@/components/AdminNotificationsButton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AdminChatSidebar } from "@/components/AdminChatSidebar";
import { Button } from "./ui/button";

export function AdminHeader() {
	const [chatOpen, setChatOpen] = useState(false);
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
					<Button
						variant="outline"
						size="icon"
						aria-label="Open Chat Sidebar"
						onClick={() => setChatOpen(true)}
						type="button"
					>
						<MessageSquare className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
					</Button>
				</div>
			</div>
			{/* <AdminChatSidebar open={chatOpen} onOpenChange={setChatOpen} /> */}
		</header>
	);
}

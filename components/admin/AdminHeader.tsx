"use client";

import { Search } from "lucide-react";
import { AdminNotificationsButton } from "@/components/admin/AdminNotificationsButton";
import { AdminRemindersDropdown } from "@/components/admin/AdminRemindersDropdown";
import { AdminChatButton } from "@/components/admin/AdminChatButton";
import { Button } from "@/components/ui/button";
import { CommandMenu } from "@/components/CommandMenu";
import { useState } from "react";
import { AdminRightSidebar } from "@/components/admin/AdminRightSidebar";
import { StickyNote } from "lucide-react";

export function AdminHeader() {
	const [open, setOpen] = useState(false);
	const [showSidebar, setShowSidebar] = useState(false);
	const [sidebarView, setSidebarView] = useState<"chat" | "notes">("chat");

	return (
		<>
			<header className="sticky top-0 z-10 border-b bg-white dark:bg-gray-950 dark:border-gray-800">
				<div className="flex h-16 items-center justify-between px-6">
					<div className="flex-1">
						<div className="relative ml-64">
							<Button
								variant="outline"
								className="w-full justify-start text-sm text-muted-foreground sm:pr-12"
								onClick={() => setOpen(true)}
							>
								<Search className="mr-2 h-4 w-4" />
								<span>Search...</span>
								<kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
									<span className="text-xs">⌘</span>K
								</kbd>
							</Button>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<AdminNotificationsButton />
						<AdminChatButton
							onClick={() => {
								setShowSidebar(true);
								setSidebarView("chat");
							}}
						/>
						<Button
							variant="ghost"
							size="icon"
							aria-label="Notes"
							type="button"
							onClick={() => {
								setShowSidebar(true);
								setSidebarView("notes");
							}}
						>
							<StickyNote className="h-[1.2rem] w-[1.2rem]" />
						</Button>
						<AdminRemindersDropdown />
					</div>
				</div>
				<CommandMenu open={open} onOpenChange={setOpen} />
			</header>
			{showSidebar && <AdminRightSidebar view={sidebarView} />}
		</>
	);
}

"use client";

import { MessageSquare } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AdminChatButton() {
	return (
		<SidebarTrigger className="ml-2">
			<MessageSquare className="h-[1.2rem] w-[1.2rem]" />
		</SidebarTrigger>
	);
}

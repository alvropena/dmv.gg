"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AdminChatSidebar } from "@/components/admin/AdminChatSidebar";

export function AdminChatButton() {
	const [showChat, setShowChat] = useState(false);

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				aria-label="Open Chat Sidebar"
				type="button"
				onClick={() => setShowChat(!showChat)}
			>
				<MessageSquare className="h-[1.2rem] w-[1.2rem]" />
			</Button>
			{showChat && <AdminChatSidebar />}
		</>
	);
}

"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminChatButtonProps {
	onClick?: () => void;
}

export function AdminChatButton({ onClick }: AdminChatButtonProps) {
	return (
		<Button
			variant="ghost"
			size="icon"
			aria-label="Chat"
			type="button"
			onClick={onClick}
		>
			<MessageSquare className="h-[1.2rem] w-[1.2rem]" />
		</Button>
	);
}

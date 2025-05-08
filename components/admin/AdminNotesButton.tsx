"use client";

import { StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AdminSidebarNotes } from "@/components/admin/AdminSidebarNotes";

export function AdminNotesButton() {
	const [showNotes, setShowNotes] = useState(false);

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				aria-label="Notes"
				type="button"
				onClick={() => setShowNotes(!showNotes)}
			>
				<StickyNote className="h-[1.2rem] w-[1.2rem]" />
			</Button>
			{showNotes && (
				<div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80">
					<AdminSidebarNotes />
				</div>
			)}
		</>
	);
}

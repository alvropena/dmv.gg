import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Maximize, Pen } from "lucide-react";
import { useEffect, useState } from "react";
import type { Note } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export function AdminSidebarNotes() {
	const [notes, setNotes] = useState<Note[]>([]);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		fetchNotes();
	}, []);

	const fetchNotes = async () => {
		try {
			const response = await fetch("/api/notes");
			const data = await response.json();
			setNotes(Array.isArray(data) ? data : []);
		} catch {
			console.error("Failed to fetch notes");
		}
	};

	const handleAddNote = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || !content.trim()) return;
		setLoading(true);
		try {
			const response = await fetch("/api/notes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, content }),
			});
			if (response.ok) {
				setTitle("");
				setContent("");
				setOpen(false);
				fetchNotes();
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex h-full flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800">
			<div className="flex h-14 items-center justify-between border-b px-4">
				<h2 className="text-lg font-semibold">Notes</h2>
				<div className="flex items-center gap-2">
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button variant="outline" size="icon" className="h-8 w-8">
								<Pen className="h-4 w-4" />
								<span className="sr-only">Add note</span>
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-md">
							<DialogHeader>
								<DialogTitle>Add Note</DialogTitle>
							</DialogHeader>
							<form onSubmit={handleAddNote} className="space-y-4 pt-2">
								<Input
									placeholder="Title"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									disabled={loading}
								/>
								<Textarea
									placeholder="Content"
									value={content}
									onChange={(e) => setContent(e.target.value)}
									rows={3}
									disabled={loading}
								/>
								<Button
									type="submit"
									size="sm"
									disabled={loading || !title.trim() || !content.trim()}
									className="w-full"
								>
									Add Note
								</Button>
							</form>
						</DialogContent>
					</Dialog>
					<Link href="/notes">
						<Button variant="outline" size="icon" className="h-8 w-8">
							<Maximize className="h-4 w-4" />
							<span className="sr-only">View all notes</span>
						</Button>
					</Link>
				</div>
			</div>
			<ScrollArea className="flex-1 p-4">
				<div className="space-y-4">
					{Array.isArray(notes) && notes.length > 0 ? (
						notes.map((note) => (
							<Card key={note.id} className="p-4">
								<h3 className="font-medium">{note.title}</h3>
								<p className="text-sm text-muted-foreground line-clamp-2">
									{note.content}
								</p>
							</Card>
						))
					) : (
						<p className="text-sm text-muted-foreground text-center">
							No notes yet. Add your first note!
						</p>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}

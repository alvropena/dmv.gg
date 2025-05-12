"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Loader2, MessageSquare, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Maximize, Pen } from "lucide-react";
import type { Note } from "@/types";

const AGENTS = [{ id: "data_analyst", name: "Data Analyst" }];

interface Message {
	id: number;
	from: "me" | "agent";
	text: string;
}

interface ChatHistory {
	[agentId: string]: Message[];
}

interface AdminRightSidebarProps {
	view: "chat" | "notes";
}

export function AdminRightSidebar({ view }: AdminRightSidebarProps) {
	const [selectedAgent] = useState("data_analyst");
	const [chatHistory, setChatHistory] = useState<ChatHistory>(() => {
		const initialHistory: ChatHistory = {};
		for (const agent of AGENTS) {
			initialHistory[agent.id] = [];
		}
		return initialHistory;
	});
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Notes state
	const [notes, setNotes] = useState<Note[]>([]);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (view === "notes") {
			fetchNotes();
		}
	}, [view]);

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

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	const adjustTextareaHeight = useCallback(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;
		textarea.style.height = "auto";
		const lineHeight = Number.parseInt(getComputedStyle(textarea).lineHeight);
		const maxHeight = lineHeight * 14;
		const newHeight = Math.min(textarea.scrollHeight, maxHeight);
		textarea.style.height = `${newHeight}px`;
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [scrollToBottom]);

	useEffect(() => {
		adjustTextareaHeight();
	}, [adjustTextareaHeight]);

	async function handleSend(e?: React.FormEvent) {
		if (e) e.preventDefault();
		if (!input.trim() || isLoading) return;

		const userMessage = { id: Date.now(), from: "me" as const, text: input };
		setChatHistory((prev) => ({
			...prev,
			[selectedAgent]: [...prev[selectedAgent], userMessage],
		}));
		setInput("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: chatHistory[selectedAgent],
					agent: selectedAgent,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to send message");
			}

			const data = await response.json();
			const agentMessage: Message = {
				id: Date.now(),
				from: "agent",
				text: data.message,
			};

			setChatHistory((prev) => ({
				...prev,
				[selectedAgent]: [...prev[selectedAgent], agentMessage],
			}));
		} catch (error) {
			console.error("Error sending message:", error);
			const errorMessage = {
				id: Date.now(),
				from: "agent" as const,
				text: "Sorry, I encountered an error. Please try again.",
			};

			setChatHistory((prev) => ({
				...prev,
				[selectedAgent]: [...prev[selectedAgent], errorMessage],
			}));
		} finally {
			setIsLoading(false);
		}
	}

	const renderChatView = () => (
		<>
			<div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 min-h-0">
				{chatHistory[selectedAgent].map((msg) => (
					<div
						key={msg.id}
						className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
					>
						<div
							className={`rounded-lg px-3 py-2 max-w-[70%] text-sm ${
								msg.from === "me"
									? "bg-[#000099] text-white"
									: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
							}`}
						>
							{msg.text}
						</div>
					</div>
				))}
				{isLoading && (
					<div className="flex justify-start">
						<div className="rounded-lg px-3 py-2 max-w-[70%] text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
							<Loader2 className="h-4 w-4 animate-spin" />
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>
			<form
				onSubmit={handleSend}
				className="flex items-center gap-2 border-t border-gray-200 dark:border-gray-800 p-3"
			>
				<Textarea
					ref={textareaRef}
					className="flex-1 resize-none min-h-[40px] max-h-[168px] overflow-y-auto"
					placeholder="Type a message..."
					value={input}
					onChange={(e) => {
						setInput(e.target.value);
						if (textareaRef.current) {
							textareaRef.current.style.height = "auto";
							const scrollHeight = textareaRef.current.scrollHeight;
							const lineHeight = Number.parseInt(
								getComputedStyle(textareaRef.current).lineHeight,
							);
							const maxHeight = lineHeight * 14;
							textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
						}
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSend(e);
						}
					}}
					disabled={isLoading}
					rows={1}
				/>
				<Button
					type="submit"
					aria-label="Send message"
					className="bg-[#000099] hover:bg-blue-900 text-white"
					size="icon"
					disabled={isLoading}
				>
					{isLoading ? (
						<Loader2 className="h-5 w-5 animate-spin" />
					) : (
						<ArrowUp className="h-5 w-5" />
					)}
				</Button>
			</form>
		</>
	);

	const renderNotesView = () => (
		<>
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
		</>
	);

	return (
		<Sidebar side="right" collapsible="offcanvas">
			<SidebarHeader className="flex items-center justify-between p-4">
				<div className="flex items-center gap-2">
					{view === "chat" ? (
						<MessageSquare className="h-5 w-5" />
					) : (
						<StickyNote className="h-5 w-5" />
					)}
					<span className="font-semibold">
						{view === "chat" ? "Chat" : "Notes"}
					</span>
				</div>
				<SidebarTrigger />
			</SidebarHeader>
			<SidebarContent>
				{view === "chat" ? renderChatView() : renderNotesView()}
			</SidebarContent>
		</Sidebar>
	);
}

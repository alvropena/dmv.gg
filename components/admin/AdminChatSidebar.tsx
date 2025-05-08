"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import { ArrowUp, SquarePen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const AGENTS = [
	{ id: "content_planner", name: "Content Planner" },
	{ id: "seo_specialist", name: "SEO Specialist" },
	{ id: "copywriter", name: "Copywriter" },
	{ id: "editor", name: "Editor" },
	{ id: "researcher", name: "Researcher" },
];

interface Message {
	id: number;
	from: "me" | "agent";
	text: string;
}

export function AdminChatSidebar() {
	const [selectedAgent, setSelectedAgent] = useState("content_planner");
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	// Scroll to bottom when messages change
	useEffect(() => {
		scrollToBottom();
	}, [scrollToBottom]);

	async function handleSend(e?: React.FormEvent) {
		if (e) e.preventDefault();
		if (!input.trim() || isLoading) return;

		const userMessage = { id: Date.now(), from: "me" as const, text: input };
		setMessages((msgs) => [...msgs, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: [...messages, userMessage],
					agent: selectedAgent,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to send message");
			}

			const data = await response.json();
			setMessages((msgs) => [
				...msgs,
				{ id: Date.now(), from: "agent", text: data.message },
			]);
		} catch (error) {
			console.error("Error sending message:", error);
			setMessages((msgs) => [
				...msgs,
				{
					id: Date.now(),
					from: "agent",
					text: "Sorry, I encountered an error. Please try again.",
				},
			]);
		} finally {
			setIsLoading(false);
		}
	}

	function handleNewChat() {
		setMessages([]);
		setInput("");
	}

	return (
		<Sidebar
			side="right"
			variant="sidebar"
			collapsible="icon"
			className="fixed right-0 top-0 z-40 h-full bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-lg"
			style={{ width: "20rem", minWidth: "16rem", maxWidth: "100vw" }}
		>
			<SidebarHeader className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 p-4">
				<div className="flex items-center w-full gap-2">
					<Select value={selectedAgent} onValueChange={setSelectedAgent}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select agent" />
						</SelectTrigger>
						<SelectContent>
							{AGENTS.map((agent) => (
								<SelectItem key={agent.id} value={agent.id}>
									{agent.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						type="button"
						aria-label="New chat"
						onClick={handleNewChat}
						variant="outline"
						size="icon"
					>
						<SquarePen className="h-5 w-5" />
					</Button>
				</div>
			</SidebarHeader>
			<SidebarContent className="flex-1 flex flex-col p-0">
				<div
					className="flex-1 overflow-y-auto px-4 py-2 space-y-2"
					style={{ minHeight: 0 }}
				>
					{messages.map((msg) => (
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
					<Input
						className="flex-1"
						placeholder="Type a message..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) handleSend(e);
						}}
						disabled={isLoading}
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
			</SidebarContent>
		</Sidebar>
	);
}

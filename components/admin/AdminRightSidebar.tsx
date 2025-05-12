"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const AGENTS = [{ id: "data_analyst", name: "Data Analyst" }];

interface Message {
	id: number;
	from: "me" | "agent";
	text: string;
}

interface ChatHistory {
	[agentId: string]: Message[];
}

export function AdminRightSidebar() {
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

	return (
		<Sidebar side="right" collapsible="offcanvas">
			<SidebarHeader className="flex items-center justify-between p-4">
				<div className="flex items-center gap-2">
					<MessageSquare className="h-5 w-5" />
					<span className="font-semibold">Chat</span>
				</div>
				<SidebarTrigger />
			</SidebarHeader>
			<SidebarContent>
				<div
					className="flex-1 overflow-y-auto px-4 py-2 space-y-2"
					style={{ minHeight: 0 }}
				>
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
			</SidebarContent>
		</Sidebar>
	);
}

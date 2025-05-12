"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { SupportRequest } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function TicketList({
	onSelect,
}: { onSelect: (ticket: SupportRequest) => void }) {
	const [tickets, setTickets] = useState<SupportRequest[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTickets = async () => {
			try {
				const response = await fetch(
					"/api/support?sortField=createdAt&sortDirection=desc",
				);
				const data = await response.json();
				if (response.ok) {
					setTickets(data.supportRequests);
				}
			} catch (error) {
				console.error("Error fetching tickets:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchTickets();
	}, []);

	const SKELETON_IDS = [
		"skeleton-1",
		"skeleton-2",
		"skeleton-3",
		"skeleton-4",
		"skeleton-5",
	];

	if (loading) {
		return (
			<div className="space-y-2">
				{SKELETON_IDS.map((id) => (
					<TicketSkeleton key={id} />
				))}
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{tickets.map((ticket) => (
				<button
					key={ticket.id}
					className="w-full text-left p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
					onClick={() => onSelect(ticket)}
					onKeyDown={(e) => e.key === "Enter" && onSelect(ticket)}
					type="button"
				>
					<div className="flex justify-between items-start mb-1">
						<span className="font-medium">
							{ticket.user
								? `${ticket.user.firstName} ${ticket.user.lastName}`
								: ticket.email || "Anonymous"}
						</span>
						<Badge variant="outline">{ticket.status}</Badge>
					</div>
					<p className="text-sm text-muted-foreground line-clamp-2">
						{ticket.message}
					</p>
					<p className="text-xs text-muted-foreground mt-1">
						{new Date(ticket.createdAt).toLocaleDateString()}
					</p>
				</button>
			))}
		</div>
	);
}

function TicketSkeleton() {
	return (
		<div className="p-3 border rounded-lg space-y-2">
			<div className="flex justify-between items-start mb-1">
				<Skeleton className="h-4 w-32 rounded" />
				<Skeleton className="h-5 w-12 rounded" />
			</div>
			<Skeleton className="h-3 w-full rounded" />
			<Skeleton className="h-3 w-2/3 rounded" />
			<Skeleton className="h-3 w-16 mt-2 rounded" />
		</div>
	);
}

export default function SupportPage() {
	const [selectedTicket, setSelectedTicket] = useState<SupportRequest | null>(
		null,
	);
	const [newMessage, setNewMessage] = useState("");
	const [isSending, setIsSending] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

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
		adjustTextareaHeight();
	}, [adjustTextareaHeight]);

	const handleSendMessage = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!selectedTicket || !newMessage.trim()) return;

		setIsSending(true);
		try {
			const response = await fetch(
				`/api/support/${selectedTicket.id}/respond`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ message: newMessage }),
				},
			);

			if (response.ok) {
				const updatedTicket = await response.json();
				setSelectedTicket(updatedTicket);
				setNewMessage("");
			}
		} catch (error) {
			console.error("Error sending message:", error);
		} finally {
			setIsSending(false);
		}
	};

	return (
		<div className="flex h-full">
			{/* Ticket List Column - 1/3 width */}
			<div className="w-1/3 border-r p-4">
				<Card>
					<CardHeader>
						<CardTitle>Support Tickets</CardTitle>
					</CardHeader>
					<CardContent>
						<ScrollArea className="h-[calc(100vh-12rem)]">
							<TicketList onSelect={setSelectedTicket} />
						</ScrollArea>
					</CardContent>
				</Card>
			</div>

			{/* Chat Interface Column - 2/3 width */}
			<div className="w-2/3 p-4">
				<Card className="h-full flex flex-col">
					<CardHeader>
						<CardTitle>
							{selectedTicket ? (
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-lg">Ticket #{selectedTicket.id}</span>
										<Badge
											variant={
												selectedTicket.status === "OPEN"
													? "default"
													: "secondary"
											}
										>
											{selectedTicket.status}
										</Badge>
									</div>
									<div className="text-sm text-muted-foreground">
										{selectedTicket.user
											? `${selectedTicket.user.firstName} ${selectedTicket.user.lastName} (${selectedTicket.user.email})`
											: selectedTicket.email || "Anonymous"}
										<span className="mx-2">•</span>
										{new Date(selectedTicket.createdAt).toLocaleString()}
									</div>
								</div>
							) : (
								"Select a ticket to start chatting"
							)}
						</CardTitle>
					</CardHeader>
					<CardContent className="flex-1 flex flex-col">
						{selectedTicket ? (
							<>
								<ScrollArea className="flex-1 mb-4">
									<div className="space-y-4">
										{/* Initial Support Request */}
										<div className="flex flex-col space-y-2">
											<div className="bg-muted p-3 rounded-lg max-w-[80%]">
												<p className="whitespace-pre-wrap">
													{selectedTicket.message}
												</p>
												<p className="text-xs text-muted-foreground mt-1">
													{new Date(selectedTicket.createdAt).toLocaleString()}
												</p>
											</div>
										</div>
										{/* Resolution/Response if exists */}
										{selectedTicket.resolution && (
											<div className="flex flex-col items-end space-y-2">
												<div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%]">
													<p className="whitespace-pre-wrap">
														{selectedTicket.resolution}
													</p>
													<p className="text-xs text-primary-foreground/70 mt-1">
														Support Team
													</p>
												</div>
											</div>
										)}
									</div>
								</ScrollArea>

								{/* Message Input */}
								<form
									onSubmit={handleSendMessage}
									className="flex items-center gap-2 border-t border-gray-200 dark:border-gray-800 pt-4 p-3"
								>
									<Textarea
										ref={textareaRef}
										className="flex-1 resize-none min-h-[40px] max-h-[168px] overflow-y-auto"
										placeholder="Type your response..."
										value={newMessage}
										onChange={(e) => {
											setNewMessage(e.target.value);
											adjustTextareaHeight();
										}}
										onKeyDown={(e) => {
											if (e.key === "Enter" && !e.shiftKey) {
												e.preventDefault();
												handleSendMessage(e);
											}
										}}
										disabled={isSending}
										rows={1}
									/>
									<Button
										type="submit"
										aria-label="Send message"
										className="bg-[#000099] hover:bg-blue-900 text-white"
										size="icon"
										disabled={isSending || !newMessage.trim()}
									>
										{isSending ? (
											<Loader2 className="h-5 w-5 animate-spin" />
										) : (
											<ArrowUp className="h-5 w-5" />
										)}
									</Button>
								</form>
							</>
						) : (
							<div className="flex items-center justify-center h-[calc(100vh-12rem)] text-muted-foreground">
								Select a ticket from the list to start chatting
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

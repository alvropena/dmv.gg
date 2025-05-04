"use client";
import {
	MoreHorizontal,
	MessageSquare,
	CheckCircle2,
	Clock,
	XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import type { SupportRequest } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditSupportDialog } from "./EditSupportDialog";

export function SupportTable({
	searchQuery,
	sortField,
	sortDirection,
}: {
	searchQuery?: string;
	sortField: string;
	sortDirection: "asc" | "desc";
}) {
	const [tickets, setTickets] = useState<SupportRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const { toast } = useToast();
	const [selectedTicket, setSelectedTicket] = useState<SupportRequest | null>(
		null,
	);
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	useEffect(() => {
		const fetchTickets = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					`/api/support?page=${page}&limit=21&sortField=${sortField}&sortDirection=${sortDirection}${searchQuery ? `&search=${searchQuery}` : ""}`,
				);
				const data = await response.json();
				if (response.ok) {
					setTickets(data.supportRequests);
					setTotalPages(data.totalPages);
				} else {
					throw new Error(data.error || "Failed to fetch support tickets");
				}
			} catch (error) {
				console.error("Error fetching support tickets:", error);
				toast({
					title: "Error",
					description: "Failed to fetch support tickets",
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchTickets();
	}, [searchQuery, page, sortField, sortDirection, toast]);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "open":
				return (
					<Badge
						variant="outline"
						className="bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30"
					>
						<Clock className="w-3 h-3 mr-1" />
						Open
					</Badge>
				);
			case "in_progress":
				return (
					<Badge
						variant="outline"
						className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
					>
						<MessageSquare className="w-3 h-3 mr-1" />
						In Progress
					</Badge>
				);
			case "resolved":
				return (
					<Badge
						variant="outline"
						className="bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30"
					>
						<CheckCircle2 className="w-3 h-3 mr-1" />
						Resolved
					</Badge>
				);
			case "closed":
				return (
					<Badge
						variant="outline"
						className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-gray-900/30"
					>
						<XCircle className="w-3 h-3 mr-1" />
						Closed
					</Badge>
				);
			default:
				return (
					<Badge
						variant="outline"
						className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-gray-900/30"
					>
						{status}
					</Badge>
				);
		}
	};

	return (
		<div className="w-full overflow-auto">
			<table className="w-full caption-bottom text-sm">
				<thead className="border-b">
					<tr className="text-left">
						<th className="px-4 py-3 font-medium">User</th>
						<th className="px-4 py-3 font-medium">Message</th>
						<th className="px-4 py-3 font-medium text-center">Status</th>
						<th className="px-4 py-3 font-medium text-center">Created</th>
						<th className="px-4 py-3 font-medium text-center">Updated</th>
						<th className="px-4 py-3 font-medium text-center">Resolved</th>
						<th className="px-4 py-3 font-medium sr-only">Actions</th>
					</tr>
				</thead>
				<tbody>
					{loading ? (
						Array.from({ length: 21 }).map((_, idx) => (
							<tr key={`loading-skel-${idx}`}> 
								<td className="px-4 py-3 w-[180px]">
									<div className="h-8 w-full bg-muted animate-pulse rounded" />
								</td>
								<td className="px-4 py-3 w-[300px]">
									<div className="h-8 w-full bg-muted animate-pulse rounded" />
								</td>
								<td className="px-4 py-3 text-center w-[120px]">
									<div className="h-8 w-full bg-muted animate-pulse rounded mx-auto" />
								</td>
								<td className="px-4 py-3 text-center w-[160px]">
									<div className="h-8 w-full bg-muted animate-pulse rounded mx-auto" />
								</td>
								<td className="px-4 py-3 text-center w-[160px]">
									<div className="h-8 w-full bg-muted animate-pulse rounded mx-auto" />
								</td>
								<td className="px-4 py-3 text-center w-[160px]">
									<div className="h-8 w-full bg-muted animate-pulse rounded mx-auto" />
								</td>
								<td className="px-4 py-3 text-center w-[80px]">
									<div className="h-8 w-full bg-muted animate-pulse rounded mx-auto" />
								</td>
							</tr>
						))
					) : tickets.length === 0 ? (
						<tr>
							<td colSpan={7} className="px-4 py-3 text-center">
								No support tickets found.
							</td>
						</tr>
					) : (
						tickets.map((ticket) => (
							<tr
								key={ticket.id}
								className="border-b transition-colors hover:bg-muted/50"
							>
								<td className="px-4 py-3">
									<div>
										{ticket.user ? (
											<>
												<p className="font-medium">
													{ticket.user.firstName} {ticket.user.lastName}
												</p>
												<p className="text-muted-foreground">
													{ticket.user.email}
												</p>
											</>
										) : (
											<p className="text-muted-foreground">
												{ticket.email || "Anonymous"}
											</p>
										)}
									</div>
								</td>
								<td className="px-4 py-3">
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<p className="line-clamp-2 cursor-pointer">
													{ticket.message}
												</p>
											</TooltipTrigger>
											<TooltipContent>
												<p className="max-w-md whitespace-pre-wrap">
													{ticket.message}
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</td>
								<td className="px-4 py-3 text-center">
									{getStatusBadge(ticket.status)}
								</td>
								<td className="px-4 py-3 text-center">
									{new Date(ticket.createdAt).toLocaleString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</td>
								<td className="px-4 py-3 text-center">
									{new Date(ticket.updatedAt).toLocaleString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</td>
								<td className="px-4 py-3 text-center">
									{ticket.resolvedAt
										? new Date(ticket.resolvedAt).toLocaleString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})
										: "-"}
								</td>
								<td className="px-4 py-3 text-center">
									<div className="flex justify-center">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">Open menu</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													className="cursor-pointer"
													onClick={() => {
														setSelectedTicket(ticket);
														setEditDialogOpen(true);
													}}
												>
													Edit Ticket
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>

			{/* Pagination */}
			{!loading && tickets.length > 0 && (
				<div className="mt-4 pb-4">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() => handlePageChange(page - 1)}
									className={`cursor-pointer ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
								/>
							</PaginationItem>

							{(() => {
								const pageNumbers = [];
								const totalPagesToShow = 7;
								let startPage: number;
								let endPage: number;

								if (totalPages <= totalPagesToShow) {
									startPage = 1;
									endPage = totalPages;
								} else {
									if (page <= 4) {
										startPage = 1;
										endPage = 7;
									} else if (page >= totalPages - 3) {
										startPage = totalPages - 6;
										endPage = totalPages;
									} else {
										startPage = page - 3;
										endPage = page + 3;
									}
								}

								for (let i = startPage; i <= endPage; i++) {
									pageNumbers.push(
										<PaginationItem key={i}>
											<PaginationLink
												onClick={() => handlePageChange(i)}
												isActive={i === page}
												className="cursor-pointer"
											>
												{i}
											</PaginationLink>
										</PaginationItem>,
									);
								}

								return pageNumbers;
							})()}

							<PaginationItem>
								<PaginationNext
									onClick={() => handlePageChange(page + 1)}
									className={`cursor-pointer ${page === totalPages ? "pointer-events-none opacity-50" : ""}`}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}

			<EditSupportDialog
				open={editDialogOpen}
				ticket={selectedTicket}
				onOpenChange={setEditDialogOpen}
			/>
		</div>
	);
}

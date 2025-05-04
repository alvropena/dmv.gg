"use client";

import { useState, useEffect } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditTestDialog } from "@/components/EditTestDialog";
import type { Test, TestType } from "@/types";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

type SortField = "score" | "status" | "startedAt" | "type";
type SortDirection = "asc" | "desc";

function CompletedBadge({ completed }: { completed: boolean }) {
	if (completed) {
		return (
			<Badge
				variant="outline"
				className="bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30"
			>
				True
			</Badge>
		);
	}
	return (
		<Badge
			variant="outline"
			className="bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30"
		>
			False
		</Badge>
	);
}

export function TestsTab() {
	const [tests, setTests] = useState<Test[]>([]);
	const [loading, setLoading] = useState(true);
	const [sortField, setSortField] = useState<SortField>("startedAt");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
	const [selectedTest, setSelectedTest] = useState<Test | null>(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const { toast } = useToast();

	useEffect(() => {
		const fetchTests = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					`/api/tests/all?page=${page}&sortField=${sortField}&sortDirection=${sortDirection}`,
				);
				if (!response.ok) throw new Error("Failed to fetch tests");
				const data = await response.json();
				setTests(data.tests);
				setTotalPages(data.totalPages);
			} catch (error) {
				console.error("Error fetching tests:", error);
				toast({
					title: "Error",
					description: "Failed to fetch tests",
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchTests();
	}, [page, sortField, sortDirection, toast]);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
		// Reset to first page when sorting changes
		setPage(1);
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	// Remove client-side sorting since it's now handled by the server
	const sortedTests = tests;

	return (
		<>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold tracking-tight">Tests</h2>
				</div>

				<Card>
					<CardContent className="p-0">
						<div className="relative w-full overflow-auto">
							<table className="w-full caption-bottom text-sm">
								<thead>
									<tr className="border-b transition-colors hover:bg-muted/5">
										<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
											ID
										</th>
										<th className="h-12 px-4 text-left align-middle font-medium">
											User ID
										</th>
										<th className="h-12 px-4 text-left align-middle font-medium">
											<Button
												variant="ghost"
												onClick={() => handleSort("score")}
												className="flex items-center gap-1 -ml-4 h-12 hover:bg-transparent"
											>
												Score
												<ArrowUpDown className="h-4 w-4 text-muted-foreground" />
											</Button>
										</th>
										<th className="h-12 px-4 text-left align-middle font-medium">
											<Button
												variant="ghost"
												onClick={() => handleSort("type")}
												className="flex items-center gap-1 -ml-4 h-12 hover:bg-transparent"
											>
												Type
												<ArrowUpDown className="h-4 w-4 text-muted-foreground" />
											</Button>
										</th>
										<th className="h-12 px-4 text-left align-middle font-medium">
											<Button
												variant="ghost"
												onClick={() => handleSort("status")}
												className="flex items-center gap-1 -ml-4 h-12 hover:bg-transparent"
											>
												Status
												<ArrowUpDown className="h-4 w-4 text-muted-foreground" />
											</Button>
										</th>
										<th className="h-12 px-4 text-left align-middle font-medium">
											<Button
												variant="ghost"
												onClick={() => handleSort("startedAt")}
												className="flex items-center gap-1 -ml-4 h-12 hover:bg-transparent"
											>
												Started
												<ArrowUpDown className="h-4 w-4 text-muted-foreground" />
											</Button>
										</th>
										<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
											Total Questions
										</th>
										<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
											Completed
										</th>
										<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{loading ? (
										<tr>
											<td colSpan={9} className="p-4 text-center">
												Loading tests...
											</td>
										</tr>
									) : sortedTests.length === 0 ? (
										<tr>
											<td colSpan={9} className="p-4 text-center">
												No tests found.
											</td>
										</tr>
									) : (
										sortedTests.map((test) => (
											<tr
												key={test.id}
												className="border-b transition-colors hover:bg-muted/5"
											>
												<td className="p-4 align-middle text-muted-foreground">
													{test.id.slice(0, 8)}
												</td>
												<td className="p-4 align-middle text-muted-foreground">
													{test.userId}
												</td>
												<td className="p-4 align-middle">
													{test.status === "in_progress" ? (
														<span className="text-muted-foreground">-</span>
													) : (
														<Badge
															variant="outline"
															className={`${
																test.score >= 89.13
																	? "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30"
																	: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30"
															} w-16 flex items-center justify-center`}
														>
															{test.score}%
														</Badge>
													)}
												</td>
												<td className="p-4 align-middle">
													<TestTypeBadge type={test.type} />
												</td>
												<td className="p-4 align-middle">
													<StatusBadge status={test.status} />
												</td>
												<td className="p-4 align-middle">
													{new Date(test.startedAt).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "numeric",
															year: "numeric",
															hour: "2-digit",
															minute: "2-digit",
														},
													)}
												</td>
												<td className="p-4 align-middle">
													{test.totalQuestions}
												</td>
												<td className="p-4 align-middle">
													<CompletedBadge completed={!!test.completedAt} />
												</td>
												<td className="p-4 align-middle">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" className="h-8 w-8 p-0">
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={() => setSelectedTest(test)}
															>
																Edit Test
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>

							{/* Pagination */}
							{!loading && tests.length > 0 && (
								<div className="mt-4">
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
													// If total pages is less than 7, show all pages
													startPage = 1;
													endPage = totalPages;
												} else {
													// Calculate start and end pages
													if (page <= 4) {
														// First 7 pages
														startPage = 1;
														endPage = 7;
													} else if (page >= totalPages - 3) {
														// Last 7 pages
														startPage = totalPages - 6;
														endPage = totalPages;
													} else {
														// Middle pages - center current page
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
						</div>
					</CardContent>
				</Card>
			</div>

			<EditTestDialog
				test={selectedTest}
				open={!!selectedTest}
				onOpenChange={(open) => !open && setSelectedTest(null)}
			/>
		</>
	);
}

function StatusBadge({ status }: { status: string }) {
	switch (status) {
		case "completed":
			return (
				<Badge
					variant="outline"
					className="bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30"
				>
					Completed
				</Badge>
			);
		case "in_progress":
			return (
				<Badge
					variant="outline"
					className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
				>
					In Progress
				</Badge>
			);
		default:
			return null;
	}
}

function TestTypeBadge({ type }: { type: TestType }) {
	switch (type) {
		case "NEW":
			return (
				<Badge
					variant="outline"
					className="bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30"
				>
					New Test
				</Badge>
			);
		case "REVIEW":
			return (
				<Badge
					variant="outline"
					className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30"
				>
					Review
				</Badge>
			);
		case "WEAK_AREAS":
			return (
				<Badge
					variant="outline"
					className="bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30"
				>
					Weak Areas
				</Badge>
			);
		default:
			return null;
	}
}

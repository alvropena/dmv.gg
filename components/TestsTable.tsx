"use client";
import { useEffect, useState, useCallback } from "react";
import { MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import type { Test, TestType } from "@/types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditTestDialog } from "@/components/dialogs/EditTestDialog";
import { ConfirmDeleteTestDialog } from "@/components/dialogs/ConfirmDeleteTestDialog";

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

export function TestsTable({
	searchQuery,
	sortField,
	sortDirection,
}: {
	searchQuery?: string;
	sortField: string;
	sortDirection: "asc" | "desc";
}) {
	const [tests, setTests] = useState<Test[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const { toast } = useToast();
	const [selectedTest, setSelectedTest] = useState<Test | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [testToDelete, setTestToDelete] = useState<Test | null>(null);

	useEffect(() => {
		const fetchTests = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					`/api/tests/all?page=${page}&sortField=${sortField}&sortDirection=${sortDirection}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`,
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
	}, [searchQuery, page, sortField, sortDirection, toast]);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleDeleteTest = useCallback((test: Test) => {
		setTestToDelete(test);
		setDeleteDialogOpen(true);
	}, []);

	const confirmDeleteTest = useCallback(async () => {
		if (!testToDelete) return;
		try {
			setLoading(true);
			const response = await fetch(`/api/tests/testId?testId=${testToDelete.id}`, {
				method: "DELETE",
			});
			if (!response.ok) throw new Error("Failed to delete test");
			setTests((prev) => prev.filter((t) => t.id !== testToDelete.id));
			toast({
				title: "Test deleted",
				description: "The test and its related data have been deleted.",
				variant: "default",
			});
		} catch (error) {
			console.error("Error deleting test:", error);
			toast({
				title: "Error",
				description: "Failed to delete test",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
			setDeleteDialogOpen(false);
			setTestToDelete(null);
		}
	}, [testToDelete, toast]);

	return (
		<div className="w-full overflow-auto">
			<table className="w-full caption-bottom text-sm">
				<thead>
					<tr className="border-b transition-colors hover:bg-muted/5">
						<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
							ID
						</th>
						<th className="h-12 px-4 text-left align-middle font-medium">
							User
						</th>
						<th className="h-12 px-4 text-left align-middle font-medium">
							Score
						</th>
						<th className="h-12 px-4 text-left align-middle font-medium">
							Type
						</th>
						<th className="h-12 px-4 text-left align-middle font-medium">
							Status
						</th>
						<th className="h-12 px-4 text-left align-middle font-medium">
							Started
						</th>
						<th className="h-12 px-4 text-left align-middle font-medium">
							Last Updated
						</th>
						<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
							Questions Answered
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
						Array.from({ length: 21 }).map((_, idx) => (
							<tr key={`loading-skel-${idx}`}>
								<td className="p-4 align-middle text-muted-foreground">
									<div className="h-4 w-full bg-muted animate-pulse rounded" />
								</td>
								<td className="p-4 align-middle">
									<div className="h-4 w-full bg-muted animate-pulse rounded" />
									<div className="h-3 w-3/4 bg-muted animate-pulse rounded mt-1" />
								</td>
								<td className="p-4 align-middle">
									<div className="h-4 w-full bg-muted animate-pulse rounded mx-auto" />
								</td>
								<td className="p-4 align-middle">
									<div className="h-4 w-full bg-muted animate-pulse rounded mx-auto" />
								</td>
								<td className="p-4 align-middle">
									<div className="h-4 w-full bg-muted animate-pulse rounded mx-auto" />
								</td>
								<td className="p-4 align-middle">
									<div className="h-4 w-full bg-muted animate-pulse rounded mx-auto" />
								</td>
								<td className="p-4 align-middle">
									<div className="h-4 w-full bg-muted animate-pulse rounded mx-auto" />
								</td>
								<td className="p-4 align-middle">
									<div className="h-4 w-full bg-muted animate-pulse rounded mx-auto" />
								</td>
								<td className="p-4 align-middle">
									<div className="h-4 w-full bg-muted animate-pulse rounded mx-auto" />
								</td>
								<td className="p-4 align-middle">
									<div className="h-4 w-full bg-muted animate-pulse rounded mx-auto" />
								</td>
							</tr>
						))
					) : tests.length === 0 ? (
						<tr>
							<td colSpan={10} className="p-4 text-center">
								No tests found.
							</td>
						</tr>
					) : (
						tests.map((test) => {
							const lastAnswered =
								test.answers && test.answers.length > 0
									? test.answers.reduce(
											(latest, a) => {
												const date = a.answeredAt
													? new Date(a.answeredAt)
													: a.updatedAt
														? new Date(a.updatedAt)
														: null;
												if (!date) return latest;
												return !latest || date > latest ? date : latest;
											},
											null as Date | null,
										)
									: null;
							const questionsAnswered = test.answers
								? test.answers.filter((a) => a.selectedAnswer !== null).length
								: 0;
							return (
								<tr
									key={test.id}
									className="border-b transition-colors hover:bg-muted/5"
								>
									<td className="p-4 align-middle text-muted-foreground">
										{test.id.slice(0, 8)}
									</td>
									<td className="p-4 align-middle">
										<div>
											<p className="font-medium">
												{test.user.firstName} {test.user.lastName}
											</p>
											<p className="text-muted-foreground">{test.user.email}</p>
										</div>
									</td>
									<td className="p-4 align-middle">
										{test.status === "in_progress" ? (
											<span className="text-muted-foreground">-</span>
										) : (
											<Badge
												variant="outline"
												className={
													(test.score >= 89.13
														? "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30"
														: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30") +
													" w-16 flex items-center justify-center"
												}
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
										{new Date(test.startedAt).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</td>
									<td className="p-4 align-middle">
										{lastAnswered
											? lastAnswered.toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})
											: "-"}
									</td>
									<td className="p-4 align-middle">{questionsAnswered}</td>
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
													className="cursor-pointer"
													onClick={() => setSelectedTest(test)}
												>
													<Pencil className="mr-4 h-4 w-4" />
													Edit Test
												</DropdownMenuItem>
												<DropdownMenuItem
													className="cursor-pointer text-red-600 focus:text-red-700"
													onClick={() => handleDeleteTest(test)}
												>
													<span className="mr-4">
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
															<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
														</svg>
													</span>
													Delete Test
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>

			{/* Pagination */}
			{!loading && tests.length > 0 && (
				<div className="my-4">
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

			<EditTestDialog
				test={selectedTest}
				open={!!selectedTest}
				onOpenChange={(open) => !open && setSelectedTest(null)}
			/>

			<ConfirmDeleteTestDialog
				isOpen={deleteDialogOpen}
				onClose={() => { setDeleteDialogOpen(false); setTestToDelete(null); }}
				onConfirm={confirmDeleteTest}
				testInfo={testToDelete ? {
					startedAt: typeof testToDelete.startedAt === 'string' ? testToDelete.startedAt : new Date(testToDelete.startedAt).toISOString(),
					user: testToDelete.user ? {
						firstName: testToDelete.user.firstName ?? '',
						lastName: testToDelete.user.lastName ?? '',
						email: testToDelete.user.email ?? ''
					} : undefined
				} : undefined}
			/>
		</div>
	);
}

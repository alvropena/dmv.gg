"use client";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import type { Question } from "@prisma/client";
import { getQuestions } from "@/app/actions/questions";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Loader2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { QuestionAnalyticsDialog } from "@/components/dialogs/QuestionAnalyticsDialog";
import { DeleteQuestionDialog } from "@/components/dialogs/DeleteQuestionDialog";
import { EditQuestionDialog } from "@/components/dialogs/EditQuestionDialog";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

// Function to truncate text
const truncateText = (text: string, maxLength = 50) => {
	if (text.length <= maxLength) return text;
	return `${text.substring(0, maxLength)}...`;
};

// Function to get the first 6 characters of the ID
const shortenId = (id: string, length = 6) => {
	return id.substring(0, length);
};

export type SortDirection = "asc" | "desc";
export type SortField = "title" | "correctAnswer" | "createdAt" | null;

export function QuestionTable({
	searchQuery,
	sortField,
	sortDirection,
}: {
	searchQuery?: string;
	sortField?: SortField;
	sortDirection?: SortDirection;
}) {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
		null,
	);
	const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);

	const { toast } = useToast();

	// Fetch questions when component mounts, searchQuery, page, or sort params change
	useEffect(() => {
		const fetchQuestions = async () => {
			try {
				setLoading(true);

				const actualSortField = sortField || "createdAt";
				const actualSortDirection = sortDirection || "desc";

				const result = await getQuestions(
					searchQuery,
					page,
					21, // Items per page
					actualSortField,
					actualSortDirection,
				);

				setQuestions(result.questions);
				setTotalPages(Math.ceil(result.total / 21));
			} catch (error) {
				console.error("Error fetching questions:", error);
				toast({
					title: "Error",
					description: "Failed to fetch questions",
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchQuestions();
	}, [searchQuery, sortField, sortDirection, page, toast]);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleEditQuestion = (question: Question) => {
		setSelectedQuestion(question);
		setShowEditDialog(true);
	};

	const handleViewAnalytics = (question: Question) => {
		setSelectedQuestion(question);
		setShowAnalyticsDialog(true);
	};

	const handleDeleteQuestion = (question: Question) => {
		setSelectedQuestion(question);
		setShowDeleteDialog(true);
	};

	const handleConfirmDelete = async () => {
		// TODO: Implement delete functionality
		setShowDeleteDialog(false);
		toast({
			title: "Question deleted",
			description: "The question has been deleted successfully",
		});
		// Refresh current page
		handlePageChange(page);
	};

	return (
		<div className="w-full px-4">
			{/* Edit Question Dialog */}
			<EditQuestionDialog
				question={selectedQuestion}
				open={showEditDialog}
				onOpenChange={setShowEditDialog}
				onQuestionUpdated={() => handlePageChange(page)}
			/>

			{/* Analytics Dialog */}
			<QuestionAnalyticsDialog
				question={selectedQuestion}
				open={showAnalyticsDialog}
				onOpenChange={setShowAnalyticsDialog}
			/>

			{/* Delete Confirmation Dialog */}
			<DeleteQuestionDialog
				question={selectedQuestion}
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				onConfirmDelete={handleConfirmDelete}
			/>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[60px]">ID</TableHead>
						<TableHead className="w-[350px]">Question</TableHead>
						<TableHead className="w-[60px] text-center">Answer</TableHead>
						<TableHead className="w-[100px] text-center">Category</TableHead>
						<TableHead className="w-[100px] text-center">Difficulty</TableHead>
						<TableHead className="w-[80px] text-center">Status</TableHead>
						<TableHead className="w-[100px] text-center">
							Success Rate
						</TableHead>
						<TableHead className="w-[60px] text-center">Flags</TableHead>
						<TableHead className="w-[60px] text-center">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{loading ? (
						<TableRow>
							<TableCell colSpan={9} className="h-24 text-center">
								<div className="flex items-center justify-center gap-2">
									<Loader2 className="h-4 w-4 animate-spin" />
									<span>Loading questions...</span>
								</div>
							</TableCell>
						</TableRow>
					) : questions.length === 0 ? (
						<TableRow>
							<TableCell colSpan={9} className="h-24 text-center">
								No questions found.
							</TableCell>
						</TableRow>
					) : (
						questions.map((question) => (
							<TableRow key={question.id}>
								<TableCell className="font-mono text-xs">
									{shortenId(question.id)}
								</TableCell>
								<TableCell className="font-medium">
									{truncateText(question.title, 60)}
								</TableCell>
								<TableCell className="text-center">
									{question.correctAnswer}
								</TableCell>
								<TableCell className="text-center">
									<Badge
										variant="secondary"
										className="bg-primary/10 text-primary-foreground"
									>
										General
									</Badge>
								</TableCell>
								<TableCell className="text-center">
									<Badge
										variant="outline"
										className="bg-yellow-100 text-yellow-800 border-yellow-200"
									>
										Medium
									</Badge>
								</TableCell>
								<TableCell className="text-center">
									<Badge
										variant="outline"
										className="bg-green-100 text-green-800 border-green-200"
									>
										Active
									</Badge>
								</TableCell>
								<TableCell className="text-center">78%</TableCell>
								<TableCell className="text-center">0</TableCell>
								<TableCell className="text-center">
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
													onClick={() => handleEditQuestion(question)}
												>
													Edit Question
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => handleViewAnalytics(question)}
												>
													View Analytics
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													className="text-red-600"
													onClick={() => handleDeleteQuestion(question)}
												>
													Delete Question
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			{/* Pagination */}
			{!loading && questions.length > 0 && (
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
	);
}

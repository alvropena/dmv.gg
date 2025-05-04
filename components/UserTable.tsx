"use client";
import { MoreHorizontal, Star, User as UserIcon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/RoleBadge";
import { useEffect, useState } from "react";
import { getUsers } from "@/app/actions/users";
import { useToast } from "@/hooks/use-toast";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import type { User, UserRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditUserDialog } from "@/components/EditUserDialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserTable({
	searchQuery,
	sortField,
	sortDirection,
}: {
	searchQuery?: string;
	sortField: string;
	sortDirection: "asc" | "desc";
}) {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const { toast } = useToast();
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);
				const result = await getUsers(
					searchQuery,
					page,
					21,
					sortField,
					sortDirection,
				);
				setUsers(
					result.users.map((u: any) => ({
						...u,
						role: u.role as UserRole,
					})),
				);
				setTotalPages(result.totalPages);
			} catch (error) {
				console.error("Error fetching users:", error);
				toast({
					title: "Error",
					description: "Failed to fetch users",
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, [searchQuery, page, sortField, sortDirection, toast]);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	return (
		<div className="w-full overflow-auto">
			<table className="w-full caption-bottom text-sm">
				<thead className="border-b">
					<tr className="text-left">
						<th className="px-4 py-3 font-medium">Name</th>
						<th className="px-4 py-3 font-medium text-center">Age</th>
						<th className="px-4 py-3 font-medium text-center">Role</th>
						<th className="px-4 py-3 font-medium text-center">Plan</th>
						<th className="px-4 py-3 font-medium text-center">
							Has Used Free Test
						</th>
						<th className="px-4 py-3 font-medium text-center">Joined</th>
						<th className="px-4 py-3 font-medium text-center">Updated</th>
						<th className="px-4 py-3 font-medium text-center">
							Tests Completed
						</th>
						<th className="px-4 py-3 font-medium text-center">
							Tests Initiated
						</th>
						<th className="px-4 py-3 font-medium text-center">Avg. Score</th>
						<th className="px-4 py-3 font-medium sr-only">Actions</th>
					</tr>
				</thead>
				<tbody>
					{loading ? (
						<tr>
							<td colSpan={7} className="px-4 py-3 text-center">
								Loading users...
							</td>
						</tr>
					) : users.length === 0 ? (
						<tr>
							<td colSpan={7} className="px-4 py-3 text-center">
								No users found.
							</td>
						</tr>
					) : (
						users.map((user) => (
							<tr
								key={user.id}
								className="border-b transition-colors hover:bg-muted/50"
							>
								<td className="px-4 py-3">
									<div>
										<p className="font-medium">
											{user.firstName} {user.lastName}
										</p>
										<p className="text-muted-foreground">{user.email}</p>
									</div>
								</td>
								<td className="px-4 py-3 text-center">
									{user.birthday ? (
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<span>
														{Math.floor(
															(new Date().getTime() -
																new Date(user.birthday).getTime()) /
																(365.25 * 24 * 60 * 60 * 1000),
														)}
													</span>
												</TooltipTrigger>
												<TooltipContent>
													{new Date(user.birthday).toLocaleDateString("en-US", {
														month: "long",
														day: "numeric",
														year: "numeric",
													})}
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									) : (
										"-"
									)}
								</td>
								<td className="px-4 py-3 text-center">
									<div className="flex justify-center">
										<RoleBadge role={user.role} />
									</div>
								</td>
								<td className="px-4 py-3 text-center">
									{user.subscriptions.some((sub) => sub.status === "active") ? (
										<Badge
											variant="default"
											className="bg-yellow-200 text-yellow-600 border-yellow-400"
										>
											<Star className="w-3 h-3 mr-1" />
											Premium
										</Badge>
									) : (
										<Badge
											variant="secondary"
											className="bg-gray-200 text-gray-700 border-gray-300"
										>
											<UserIcon className="w-3 h-3 mr-1" />
											Free
										</Badge>
									)}
								</td>
								<td className="px-4 py-3 text-center">
									<Badge
										variant="outline"
										className={
											user.hasUsedFreeTest
												? "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30"
												: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30"
										}
									>
										{user.hasUsedFreeTest ? "True" : "False"}
									</Badge>
								</td>
								<td className="px-4 py-3 text-center">
									{new Date(user.createdAt).toLocaleString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</td>
								<td className="px-4 py-3 text-center">
									{new Date(user.updatedAt).toLocaleString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</td>
								<td className="px-4 py-3 text-center">
									{(() => {
										const completedTests = user.tests.filter(
											(test) => test.status === "completed",
										);
										return completedTests.length;
									})()}
								</td>
								<td className="px-4 py-3 text-center">
									{(() => {
										const initiatedTests = user.tests.filter(
											(test) => test.status !== "completed",
										);
										return initiatedTests.length;
									})()}
								</td>
								<td className="px-4 py-3 text-center">
									{(() => {
										const completedTests = user.tests.filter(
											(test) => test.status === "completed",
										);
										if (completedTests.length === 0) return "-";
										const totalCorrectAnswers = completedTests.reduce(
											(sum, test) =>
												sum + test.answers.filter((a) => a.isCorrect).length,
											0,
										);
										const totalQuestions = completedTests.reduce(
											(sum, test) => sum + test.totalQuestions,
											0,
										);
										const avgScore =
											totalQuestions > 0
												? Math.round(
														(totalCorrectAnswers / totalQuestions) * 100,
													)
												: 0;
										return `${avgScore}%`;
									})()}
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
														setSelectedUser(user);
														setEditDialogOpen(true);
													}}
												>
													<Pencil className="mr-2 h-4 w-4" />
													Edit User
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
			{!loading && users.length > 0 && (
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

			<EditUserDialog
				open={editDialogOpen}
				user={selectedUser}
				onOpenChange={setEditDialogOpen}
			/>
		</div>
	);
}

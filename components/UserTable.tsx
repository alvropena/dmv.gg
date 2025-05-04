"use client";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
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

type User = {
	id: string;
	name: string;
	email: string;
	role: string;
	joined: string;
	tests: number;
	avgScore: string;
	passed: boolean;
	birthday?: Date | null;
};

type SortField = "status" | "role" | "joined" | "tests" | "avgScore" | "age";
type SortDirection = "asc" | "desc";

export function UserTable({ searchQuery }: { searchQuery?: string }) {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [sortField, setSortField] = useState<SortField>("joined");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const { toast } = useToast();

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
				setUsers(result.users);
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

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	return (
		<div className="w-full overflow-auto">
			<table className="w-full caption-bottom text-sm">
				<thead className="border-b">
					<tr className="text-left">
						<th className="px-4 py-3 font-medium">Name</th>
						<th className="px-4 py-3 font-medium">
							<Button
								variant="ghost"
								onClick={() => handleSort("age")}
								className="flex items-center gap-1 mx-auto"
							>
								Age
								<ArrowUpDown className="h-4 w-4" />
							</Button>
						</th>
						<th className="px-4 py-3 font-medium">
							<Button
								variant="ghost"
								onClick={() => handleSort("role")}
								className="flex items-center gap-1 mx-auto"
							>
								Role
								<ArrowUpDown className="h-4 w-4" />
							</Button>
						</th>
						<th className="px-4 py-3 font-medium">
							<Button
								variant="ghost"
								onClick={() => handleSort("joined")}
								className="flex items-center gap-1 mx-auto"
							>
								Joined
								<ArrowUpDown className="h-4 w-4" />
							</Button>
						</th>
						<th className="px-4 py-3 font-medium">
							<Button
								variant="ghost"
								onClick={() => handleSort("tests")}
								className="flex items-center gap-1 mx-auto"
							>
								Tests
								<ArrowUpDown className="h-4 w-4" />
							</Button>
						</th>
						<th className="px-4 py-3 font-medium">
							<Button
								variant="ghost"
								onClick={() => handleSort("avgScore")}
								className="flex items-center gap-1 mx-auto"
							>
								Avg. Score
								<ArrowUpDown className="h-4 w-4" />
							</Button>
						</th>
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
										<p className="font-medium">{user.name}</p>
										<p className="text-muted-foreground">{user.email}</p>
									</div>
								</td>
								<td className="px-4 py-3 text-center">
									{user.birthday
										? Math.floor(
												(new Date().getTime() -
													new Date(user.birthday).getTime()) /
													(365.25 * 24 * 60 * 60 * 1000),
											)
										: "-"}
								</td>
								<td className="px-4 py-3 text-center">
									<div className="flex justify-center">
										<RoleBadge role={user.role} />
									</div>
								</td>
								<td className="px-4 py-3 text-center">
									{new Date(user.joined).toLocaleDateString("en-US", {
										month: "long",
										day: "numeric",
										year: "numeric",
									})}
								</td>
								<td className="px-4 py-3 text-center">{user.tests}</td>
								<td className="px-4 py-3 text-center">{user.avgScore}</td>
								<td className="px-4 py-3 text-center">
									<div className="flex justify-center">
										<Button variant="ghost" size="icon">
											<MoreHorizontal className="h-4 w-4" />
											<span className="sr-only">Open menu</span>
										</Button>
									</div>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>

			{/* Pagination */}
			{!loading && users.length > 0 && (
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

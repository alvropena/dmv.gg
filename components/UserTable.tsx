"use client";
import { useEffect, useState } from "react";
import { getUsers } from "@/app/actions/users";
import { useToast } from "@/hooks/use-toast";
import type { User, UserRole } from "@/types";
import { RoleBadge } from "@/components/RoleBadge";
import { EditUserDialog } from "@/components/dialogs/EditUserDialog";
import { UserInteractionsDialog } from "@/components/dialogs/UserInteractionsDialog";
import { UserNameCell } from "@/components/UserNameCell";
import { UserAgeCell } from "@/components/UserAgeCell";
import { UserPlanCell } from "@/components/UserPlanCell";
import { UserTestStatusCell } from "@/components/UserTestStatusCell";
import { UserDateCell } from "@/components/UserDateCell";
import { UserTestStatsCell } from "@/components/UserTestStatsCell";
import { UserActionsCell } from "@/components/UserActionsCell";
import { TablePagination } from "@/components/TablePagination";
import { TableSkeleton } from "@/components/TableSkeleton";

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
	const [showInteractionsDialog, setShowInteractionsDialog] = useState(false);

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
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
						<TableSkeleton />
					) : users.length === 0 ? (
						<tr>
							<td colSpan={11} className="px-4 py-3 text-center">
								No users found.
							</td>
						</tr>
					) : (
						users.map((user) => (
							<tr
								key={user.id}
								className="border-b transition-colors hover:bg-muted/50"
							>
								<UserNameCell
									firstName={user.firstName ?? ""}
									lastName={user.lastName ?? ""}
									email={user.email ?? ""}
								/>
								<UserAgeCell
									birthday={user.birthday?.toISOString() ?? undefined}
								/>
								<td className="px-4 py-3 text-center">
									<div className="flex justify-center">
										<RoleBadge role={user.role} />
									</div>
								</td>
								<UserPlanCell subscriptions={user.subscriptions ?? []} />
								<UserTestStatusCell
									hasUsedFreeTest={user.hasUsedFreeTest ?? false}
								/>
								<UserDateCell date={user.createdAt?.toISOString() ?? ""} />
								<UserDateCell date={user.updatedAt?.toISOString() ?? ""} />
								<UserTestStatsCell tests={user.tests} type="completed" />
								<UserTestStatsCell tests={user.tests} type="initiated" />
								<UserTestStatsCell tests={user.tests} type="average" />
								<UserActionsCell
									user={user}
									onEdit={(user) => {
										setSelectedUser(user);
										setEditDialogOpen(true);
									}}
									onViewInteractions={(user) => {
										setSelectedUser(user);
										setShowInteractionsDialog(true);
									}}
								/>
							</tr>
						))
					)}
				</tbody>
			</table>

			{!loading && users.length > 0 && (
				<TablePagination
					currentPage={page}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			)}

			<EditUserDialog
				open={editDialogOpen}
				user={selectedUser}
				onOpenChange={setEditDialogOpen}
			/>
			<UserInteractionsDialog
				open={showInteractionsDialog}
				user={selectedUser}
				onOpenChange={setShowInteractionsDialog}
			/>
		</div>
	);
}

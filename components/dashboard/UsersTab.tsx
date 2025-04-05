import type React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreHorizontal } from "lucide-react";

import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";

interface User {
	name: string;
	email: string;
	status: string;
	role: string;
	joined: string;
	tests: number;
	avgScore: string;
}

interface UsersTabProps {
	usersData: User[];
	getStatusIcon: (status: string) => React.ReactNode;
}

export function UsersTab({ usersData, getStatusIcon }: UsersTabProps) {
	return (
		<div className="mb-6">
			<div className="flex justify-between items-center mb-4">
				<div className="relative w-full max-w-md">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						placeholder="Search users..."
						className="pl-10 pr-4 py-2 w-full"
					/>
				</div>
				<Button className="flex items-center gap-1 ml-2">
					<Plus className="h-4 w-4" />
					Add User
				</Button>
			</div>

			<Card className="overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[250px]">Name</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Joined</TableHead>
							<TableHead>Tests</TableHead>
							<TableHead>Avg. Score</TableHead>
							<TableHead className="w-[50px]" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{usersData.map((user) => (
							<TableRow key={`${user.name}-${user.email}`}>
								<TableCell>
									<div>
										<div className="font-medium">{user.name}</div>
										<div className="text-sm text-gray-500">{user.email}</div>
									</div>
								</TableCell>
								<TableCell>
									<div
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
											user.status === "Active"
												? "bg-green-100 text-green-800"
												: user.status === "Inactive"
													? "bg-gray-100 text-gray-800"
													: "bg-red-100 text-red-800"
										}`}
									>
										{getStatusIcon(user.status)}
										{user.status}
									</div>
								</TableCell>
								<TableCell>
									<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
										{user.role}
									</div>
								</TableCell>
								<TableCell>{user.joined}</TableCell>
								<TableCell>{user.tests}</TableCell>
								<TableCell>{user.avgScore}</TableCell>
								<TableCell>
									<Button variant="ghost" size="icon" className="h-8 w-8">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
}

"use client";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserSortFilterProps {
	sortField: string;
	sortDirection: "asc" | "desc";
	onSortChange: (field: string) => void;
}

export function UserSortFilter({
	sortField,
	sortDirection,
	onSortChange,
}: UserSortFilterProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="flex items-center gap-2">
					<Filter className="h-4 w-4" />
					Filter
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => onSortChange("name")}
					className={sortField === "name" ? "font-medium bg-muted" : ""}
				>
					<span className="flex w-full justify-between items-center">
						Name
						{sortField === "name" && (
							<span className="ml-2">
								{sortDirection === "asc" ? "↑" : "↓"}
							</span>
						)}
					</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => onSortChange("role")}
					className={sortField === "role" ? "font-medium bg-muted" : ""}
				>
					<span className="flex w-full justify-between items-center">
						Role
						{sortField === "role" && (
							<span className="ml-2">
								{sortDirection === "asc" ? "↑" : "↓"}
							</span>
						)}
					</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => onSortChange("createdAt")}
					className={sortField === "createdAt" ? "font-medium bg-muted" : ""}
				>
					<span className="flex w-full justify-between items-center">
						Joined
						{sortField === "createdAt" && (
							<span className="ml-2">
								{sortDirection === "asc" ? "↑" : "↓"}
							</span>
						)}
					</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => onSortChange("tests")}
					className={sortField === "tests" ? "font-medium bg-muted" : ""}
				>
					<span className="flex w-full justify-between items-center">
						Tests
						{sortField === "tests" && (
							<span className="ml-2">
								{sortDirection === "asc" ? "↑" : "↓"}
							</span>
						)}
					</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => onSortChange("avgScore")}
					className={sortField === "avgScore" ? "font-medium bg-muted" : ""}
				>
					<span className="flex w-full justify-between items-center">
						Score
						{sortField === "avgScore" && (
							<span className="ml-2">
								{sortDirection === "asc" ? "↑" : "↓"}
							</span>
						)}
					</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

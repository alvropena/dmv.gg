"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowDownAZ, ArrowUpAZ } from "lucide-react";

type SortDirection = "asc" | "desc" | null;

function SortIcon({ direction }: { direction: SortDirection }) {
	if (direction === "asc") return <ArrowUpAZ className="h-4 w-4" />;
	if (direction === "desc") return <ArrowDownAZ className="h-4 w-4" />;
	return <ChevronDown className="h-4 w-4" />;
}

interface SupportSortFilterProps {
	sortField: string;
	sortDirection: SortDirection;
	onSortChange: (field: string) => void;
}

export function SupportSortFilter({
	sortField,
	sortDirection,
	onSortChange,
}: SupportSortFilterProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm">
					<SortIcon direction={sortDirection} />
					<span className="ml-2 text-xs hidden sm:inline">
						{sortField === "status" && "Sort by Status"}
						{sortField === "createdAt" &&
							(sortDirection === "desc" ? "Latest" : "Oldest")}
						{sortField === "updatedAt" && "Last Updated"}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => onSortChange("status")}>
					Sort by Status
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => onSortChange("createdAt")}>
					Latest
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => onSortChange("updatedAt")}>
					Last Updated
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

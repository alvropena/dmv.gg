"use client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowDownAZ, ArrowUpAZ } from "lucide-react";

function TestSortIcon({ direction }: { direction: "asc" | "desc" | null }) {
	if (direction === "asc") return <ArrowUpAZ className="h-4 w-4" />;
	if (direction === "desc") return <ArrowDownAZ className="h-4 w-4" />;
	return <ChevronDown className="h-4 w-4" />;
}

const TEST_SORT_FIELDS = [
	{ value: "score", label: "Score" },
	{ value: "type", label: "Type" },
	{ value: "status", label: "Status" },
	{ value: "startedAt", label: "Started" },
	{ value: "createdAt", label: "Created" },
	{ value: "updatedAt", label: "Updated" },
];

export function TestSortFilter({
	sortField,
	sortDirection,
	onSortChange,
}: {
	sortField: string;
	sortDirection: "asc" | "desc";
	onSortChange: (field: string) => void;
}) {
	const current = TEST_SORT_FIELDS.find((f) => f.value === sortField);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm">
					<TestSortIcon direction={sortDirection} />
					<span className="ml-2 text-xs hidden sm:inline">
						{current ? `Sort by ${current.label}` : "Sort"}
						{sortField === "createdAt" &&
							(sortDirection === "desc" ? " (Latest)" : " (Oldest)")}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{TEST_SORT_FIELDS.map((field) => (
					<DropdownMenuItem
						key={field.value}
						onClick={() => onSortChange(field.value)}
					>
						Sort by {field.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

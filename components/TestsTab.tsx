"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { TestSortFilter } from "./TestSortFilter";
import { TestsTable } from "./TestsTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function TestsTab() {
	const [sortField, setSortField] = useState<string>("startedAt");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
	const [searchQuery, setSearchQuery] = useState<string>("");

	const handleSort = (field: string) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	return (
		<TabsContent value="tests" className="space-y-4 mt-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="relative w-[300px]">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search by name or email..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-8 bg-white"
						/>
					</div>
					<TestSortFilter
						sortField={sortField}
						sortDirection={sortDirection}
						onSortChange={handleSort}
					/>
				</div>
			</div>
			<Card>
				<CardContent className="p-0">
					<TestsTable
						sortField={sortField}
						sortDirection={sortDirection}
						searchQuery={searchQuery}
					/>
				</CardContent>
			</Card>
		</TabsContent>
	);
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { SupportTable } from "@/components/SupportTable";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SupportSortFilter } from "./SupportSortFilter";

export function SupportTab() {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortField, setSortField] = useState("createdAt");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleSort = (field: string) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	return (
		<TabsContent value="support" className="space-y-4 mt-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="relative w-[300px]">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search support tickets..."
							className="pl-8 bg-white"
							value={searchQuery}
							onChange={handleSearch}
						/>
					</div>
				</div>
				<SupportSortFilter
					sortField={sortField}
					sortDirection={sortDirection}
					onSortChange={handleSort}
				/>
			</div>
			<Card>
				<CardContent className="p-0">
					<SupportTable
						searchQuery={searchQuery}
						sortField={sortField}
						sortDirection={sortDirection}
					/>
				</CardContent>
			</Card>
		</TabsContent>
	);
}

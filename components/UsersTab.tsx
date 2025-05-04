"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { ChevronDown, Plus, Search } from "lucide-react";
import { UserTable } from "@/components/UserTable";
import { useState } from "react";
import { Input } from "@/components/ui/input";

function Filter() {
	return (
		<div className="flex items-center">
			<ChevronDown className="h-4 w-4" />
		</div>
	);
}

export function UsersTab() {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	return (
		<TabsContent value="users" className="space-y-4 mt-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 w-full max-w-sm">
					<div className="relative w-full">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search users..."
							className="pl-8"
							value={searchQuery}
							onChange={handleSearch}
						/>
					</div>
					<Button variant="outline" size="sm">
						<Filter />
					</Button>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Add User
				</Button>
			</div>
			<Card>
				<CardContent className="p-0">
					<UserTable searchQuery={searchQuery} />
				</CardContent>
			</Card>
		</TabsContent>
	);
}

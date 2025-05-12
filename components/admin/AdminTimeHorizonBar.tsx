"use client";

import { TimeHorizonDropdown } from "@/components/TimeHorizonDropdown";

export function AdminTimeHorizonBar() {
	return (
		<div className="flex items-center justify-between">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">
					Manage your DMV Knowledge Test platform
				</p>
			</div>
			<TimeHorizonDropdown />
		</div>
	);
}

import React from "react";

interface DashboardHeaderProps {
	title?: string;
	subtitle?: string;
}

export function DashboardHeader({
	title = "Admin Dashboard",
	subtitle = "Manage your DMV Knowledge Test platform",
}: DashboardHeaderProps) {
	return (
		<div className="mb-4">
			<h1 className="text-2xl font-bold mb-1">{title}</h1>
			<h2 className="text-sm text-gray-500">{subtitle}</h2>
		</div>
	);
}

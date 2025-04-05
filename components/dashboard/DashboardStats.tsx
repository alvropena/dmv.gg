import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
	Users,
	FileText,
	CheckCircle,
	MessageSquare,
	ChevronUp,
	ChevronDown,
} from "lucide-react";

export function DashboardStats() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
			{/* Total Users Card */}
			<Card>
				<CardContent className="pt-4">
					<div className="flex justify-between items-center mb-1">
						<h3 className="text-sm text-gray-500">Total Users</h3>
						<Users className="text-gray-500 h-4 w-4" />
					</div>
					<div className="flex items-center">
						<p className="text-3xl font-bold">5,231</p>
						<span className="ml-2 text-green-500 flex items-center text-xs">
							<ChevronUp size={16} />
							+12%
						</span>
					</div>
				</CardContent>
			</Card>

			{/* Active Tests Card */}
			<Card>
				<CardContent className="pt-4">
					<div className="flex justify-between items-center mb-1">
						<h3 className="text-sm text-gray-500">Active Tests</h3>
						<FileText className="text-gray-500 h-4 w-4" />
					</div>
					<div className="flex items-center">
						<p className="text-3xl font-bold">842</p>
						<span className="ml-2 text-green-500 flex items-center text-xs">
							<ChevronUp size={16} />
							+5%
						</span>
					</div>
				</CardContent>
			</Card>

			{/* Pass Rate Card */}
			<Card>
				<CardContent className="pt-4">
					<div className="flex justify-between items-center mb-1">
						<h3 className="text-sm text-gray-500">Pass Rate</h3>
						<CheckCircle className="text-gray-500 h-4 w-4" />
					</div>
					<div className="flex items-center">
						<p className="text-3xl font-bold">76%</p>
						<span className="ml-2 text-red-500 flex items-center text-xs">
							<ChevronDown size={16} />
							-2%
						</span>
					</div>
				</CardContent>
			</Card>

			{/* Support Tickets Card */}
			<Card>
				<CardContent className="pt-4">
					<div className="flex justify-between items-center mb-1">
						<h3 className="text-sm text-gray-500">Support Tickets</h3>
						<MessageSquare className="text-gray-500 h-4 w-4" />
					</div>
					<div className="flex items-center">
						<p className="text-3xl font-bold">18</p>
						<span className="ml-2 text-green-500 flex items-center text-xs">
							<ChevronUp size={16} />
							+3
						</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

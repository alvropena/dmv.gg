import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Flag, Clock } from "lucide-react";

export function IssuesAttention() {
	return (
		<Card>
			<CardContent className="pt-4">
				<div className="flex items-center mb-4">
					<AlertTriangle className="text-red-500 mr-2 h-4 w-4" />
					<h3 className="text-base font-bold">Issues Requiring Attention</h3>
				</div>

				<div className="space-y-4">
					{/* Issue Item 1 */}
					<div className="border-b pb-3">
						<div className="flex items-center mb-1">
							<div className="rounded-full bg-red-100 p-1 mr-2">
								<AlertTriangle size={12} className="text-red-500" />
							</div>
							<h4 className="font-medium text-sm">Failed Questions Review</h4>
						</div>
						<p className="text-gray-500 mb-1 text-xs">
							5 questions have a failure rate above 80%
						</p>
						<a
							href="/dashboard/failed-questions"
							className="text-blue-500 hover:underline text-xs"
						>
							Review Questions
						</a>
					</div>

					{/* Issue Item 2 */}
					<div className="border-b pb-3">
						<div className="flex items-center mb-1">
							<div className="rounded-full bg-yellow-100 p-1 mr-2">
								<Flag size={12} className="text-yellow-600" />
							</div>
							<h4 className="font-medium text-sm">Flagged Content</h4>
						</div>
						<p className="text-gray-500 mb-1 text-xs">
							3 questions have been flagged by users for review
						</p>
						<a
							href="/dashboard/flagged-content"
							className="text-blue-500 hover:underline text-xs"
						>
							Review Flags
						</a>
					</div>

					{/* Issue Item 3 */}
					<div>
						<div className="flex items-center mb-1">
							<div className="rounded-full bg-blue-100 p-1 mr-2">
								<Clock size={12} className="text-blue-500" />
							</div>
							<h4 className="font-medium text-sm">Content Update Required</h4>
						</div>
						<p className="text-gray-500 mb-1 text-xs">
							California DMV regulations updated on 4/1/2025
						</p>
						<a
							href="/dashboard/content-updates"
							className="text-blue-500 hover:underline text-xs"
						>
							Update Content
						</a>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

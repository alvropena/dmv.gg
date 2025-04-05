import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Flag, BookOpen, MessageSquare } from "lucide-react";

export function RecentActivity() {
	return (
		<Card>
			<CardContent className="pt-4">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-base font-bold">Recent Activity</h3>
					<Button
						variant="outline"
						size="sm"
						className="rounded-md text-xs h-7"
					>
						View All
					</Button>
				</div>

				<div className="space-y-4">
					{/* Activity Item 1 */}
					<div className="flex items-start border-b pb-3">
						<div className="bg-green-100 p-2 rounded-full mr-3">
							<Users size={14} className="text-green-800" />
						</div>
						<div>
							<p className="text-sm">Sarah Johnson registered a new account</p>
							<p className="text-gray-500 text-xs">10 minutes ago</p>
						</div>
					</div>

					{/* Activity Item 2 */}
					<div className="flex items-start border-b pb-3">
						<div className="bg-blue-100 p-2 rounded-full mr-3">
							<FileText size={14} className="text-blue-800" />
						</div>
						<div>
							<p className="text-sm">
								John Smith completed California Road Signs with a score of 92%
							</p>
							<p className="text-gray-500 text-xs">25 minutes ago</p>
						</div>
					</div>

					{/* Activity Item 3 */}
					<div className="flex items-start border-b pb-3">
						<div className="bg-red-100 p-2 rounded-full mr-3">
							<Flag size={14} className="text-red-800" />
						</div>
						<div>
							<p className="text-sm">
								Michael Brown flagged question Q-1005 for review
							</p>
							<p className="text-gray-500 text-xs">1 hour ago</p>
						</div>
					</div>

					{/* Activity Item 4 */}
					<div className="flex items-start border-b pb-3">
						<div className="bg-purple-100 p-2 rounded-full mr-3">
							<BookOpen size={14} className="text-purple-800" />
						</div>
						<div>
							<p className="text-sm">
								Emily Davis added new Study Material: New York Traffic Laws
							</p>
							<p className="text-gray-500 text-xs">2 hours ago</p>
						</div>
					</div>

					{/* Activity Item 5 */}
					<div className="flex items-start">
						<div className="bg-yellow-100 p-2 rounded-full mr-3">
							<MessageSquare size={14} className="text-yellow-800" />
						</div>
						<div>
							<p className="text-sm">
								Robert Wilson opened support ticket T-4523
							</p>
							<p className="text-gray-500 text-xs">3 hours ago</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

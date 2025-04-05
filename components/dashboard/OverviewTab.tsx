import type React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	FileText,
	BookOpen,
	CheckCircle,
	Users,
	Lock,
	Settings,
	BarChart3,
	Clock,
} from "lucide-react";
import { RecentActivity } from "./RecentActivity";
import { IssuesAttention } from "./IssuesAttention";
import { QuestionForm } from "./QuestionForm";

interface OverviewTabProps {
	formData: {
		title: string;
		optionA: string;
		optionB: string;
		optionC: string;
		optionD: string;
		correctAnswer: string;
		explanation: string;
	};
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
	handleSubmit: (e: React.FormEvent) => void;
}

export function OverviewTab({
	formData,
	handleChange,
	handleSubmit,
}: OverviewTabProps) {
	const [questionFormOpen, setQuestionFormOpen] = useState(false);

	return (
		<>
			{/* Dashboard Content Sections */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<RecentActivity />
				<IssuesAttention />
			</div>

			{/* Question Form Dialog */}
			<QuestionForm
				formData={formData}
				open={questionFormOpen}
				onOpenChange={setQuestionFormOpen}
				handleChange={handleChange}
				handleSubmit={handleSubmit}
			/>

			<div className="mb-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					{/* User Engagement */}
					<Card className="overflow-hidden">
						<CardContent className="p-0">
							<div className="p-4">
								<div className="flex justify-between items-center mb-1">
									<h3 className="text-base font-medium">User Engagement</h3>
									<span className="text-green-500 text-sm font-medium">
										+8%
									</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
									<div
										className="bg-blue-600 h-2.5 rounded-full"
										style={{ width: "78%" }}
									/>
								</div>
								<p className="text-sm text-gray-500">
									78% of users complete at least one test per week
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Content Completion */}
					<Card className="overflow-hidden">
						<CardContent className="p-0">
							<div className="p-4">
								<div className="flex justify-between items-center mb-1">
									<h3 className="text-base font-medium">Content Completion</h3>
									<span className="text-green-500 text-sm font-medium">
										+5%
									</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
									<div
										className="bg-blue-600 h-2.5 rounded-full"
										style={{ width: "65%" }}
									/>
								</div>
								<p className="text-sm text-gray-500">
									65% of users complete all study materials
								</p>
							</div>
						</CardContent>
					</Card>

					{/* First-Time Pass Rate */}
					<Card className="overflow-hidden">
						<CardContent className="p-0">
							<div className="p-4">
								<div className="flex justify-between items-center mb-1">
									<h3 className="text-base font-medium">
										First-Time Pass Rate
									</h3>
									<span className="text-red-500 text-sm font-medium">-2%</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
									<div
										className="bg-blue-600 h-2.5 rounded-full"
										style={{ width: "72%" }}
									/>
								</div>
								<p className="text-sm text-gray-500">
									72% of users pass their DMV test on first attempt
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				<h2 className="text-xl font-bold mb-2">Platform Performance</h2>
				<h3 className="text-sm text-gray-500 mb-4">
					Key metrics for the past 30 days
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					{/* Add New Content */}
					<Card className="overflow-hidden">
						<CardContent className="p-4">
							<h3 className="text-lg font-medium mb-2">Add New Content</h3>
							<p className="text-sm text-gray-500 mb-4">
								Create new questions, study materials, or practice tests.
							</p>
							<div className="space-y-2">
								<Button
									className="w-full flex items-center justify-start text-sm"
									variant="outline"
									onClick={() => setQuestionFormOpen(true)}
								>
									<FileText className="mr-2 h-4 w-4" />
									Add Question
								</Button>
								<Button
									className="w-full flex items-center justify-start text-sm"
									variant="outline"
								>
									<BookOpen className="mr-2 h-4 w-4" />
									Add Study Material
								</Button>
								<Button
									className="w-full flex items-center justify-start text-sm"
									variant="outline"
								>
									<CheckCircle className="mr-2 h-4 w-4" />
									Create Practice Test
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* User Management */}
					<Card className="overflow-hidden">
						<CardContent className="p-4">
							<h3 className="text-lg font-medium mb-2">User Management</h3>
							<p className="text-sm text-gray-500 mb-4">
								Manage users, permissions, and account settings.
							</p>
							<div className="space-y-2">
								<Button
									className="w-full flex items-center justify-start text-sm"
									variant="outline"
								>
									<Users className="mr-2 h-4 w-4" />
									View All Users
								</Button>
								<Button
									className="w-full flex items-center justify-start text-sm"
									variant="outline"
								>
									<Lock className="mr-2 h-4 w-4" />
									Manage Permissions
								</Button>
								<Button
									className="w-full flex items-center justify-start text-sm"
									variant="outline"
								>
									<Settings className="mr-2 h-4 w-4" />
									Account Settings
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Analytics & Reports */}
					<Card className="overflow-hidden">
						<CardContent className="p-4">
							<h3 className="text-lg font-medium mb-2">Analytics & Reports</h3>
							<p className="text-sm text-gray-500 mb-4">
								View detailed analytics and generate reports.
							</p>
							<div className="space-y-2">
								<Button
									className="w-full flex items-center justify-start text-sm"
									variant="outline"
								>
									<BarChart3 className="mr-2 h-4 w-4" />
									Performance Analytics
								</Button>
								<Button
									className="w-full flex items-center justify-start text-sm"
									variant="outline"
								>
									<Clock className="mr-2 h-4 w-4" />
									Content Usage
								</Button>
								<Button
									className="w-full flex items-center justify-start text-sm"
									variant="outline"
								>
									<FileText className="mr-2 h-4 w-4" />
									Generate Reports
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}

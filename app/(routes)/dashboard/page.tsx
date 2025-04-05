"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { NavigationTabs } from "@/components/dashboard/NavigationTabs";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { UsersTab } from "@/components/dashboard/UsersTab";
import { ContentTab } from "@/components/dashboard/ContentTab";
import { ReportsTab } from "@/components/dashboard/ReportsTab";
import { Card, CardContent } from "@/components/ui/card";
import {
	Users,
	ChevronUp,
	ChevronDown,
	FileText,
	CheckCircle,
	MessageSquare,
} from "lucide-react";
import {
	getStatusIcon,
	getDifficultyBadge,
	getCategoryBadge,
} from "@/components/dashboard/utils";

export default function DashboardPage() {
	const [activeTab, setActiveTab] = useState("overview");
	const [formData, setFormData] = useState({
		title: "",
		optionA: "",
		optionB: "",
		optionC: "",
		optionD: "",
		correctAnswer: "",
		explanation: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form submitted:", formData);

		// Reset form after submission
		setFormData({
			title: "",
			optionA: "",
			optionB: "",
			optionC: "",
			optionD: "",
			correctAnswer: "",
			explanation: "",
		});

		// Here you would typically send the data to your API
		// fetch('/api/questions', {
		//   method: 'POST',
		//   headers: { 'Content-Type': 'application/json' },
		//   body: JSON.stringify(formData),
		// });
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
	};

	const usersData = [
		{
			name: "John Smith",
			email: "john.smith@example.com",
			status: "Active",
			role: "Student",
			joined: "Apr 2, 2025",
			tests: 12,
			avgScore: "78%",
		},
		{
			name: "Sarah Johnson",
			email: "sarah.j@example.com",
			status: "Active",
			role: "Student",
			joined: "Mar 28, 2025",
			tests: 8,
			avgScore: "92%",
		},
		{
			name: "Michael Brown",
			email: "michael.b@example.com",
			status: "Inactive",
			role: "Student",
			joined: "Feb 15, 2025",
			tests: 3,
			avgScore: "65%",
		},
		{
			name: "Emily Davis",
			email: "emily.d@example.com",
			status: "Active",
			role: "Admin",
			joined: "Jan 10, 2025",
			tests: 0,
			avgScore: "N/A",
		},
		{
			name: "Robert Wilson",
			email: "robert.w@example.com",
			status: "Suspended",
			role: "Student",
			joined: "Mar 5, 2025",
			tests: 5,
			avgScore: "71%",
		},
	];

	const contentData = [
		{
			id: "Q-1001",
			question: "What does a red octagonal sign indicate?",
			category: "Road Signs",
			difficulty: "Easy",
			status: "Active",
			successRate: "92%",
			flags: 0,
		},
		{
			id: "Q-1002",
			question: "When approaching a school crossing, what should you do?",
			category: "Safety",
			difficulty: "Medium",
			status: "Active",
			successRate: "85%",
			flags: 0,
		},
		{
			id: "Q-1003",
			question: "What is the minimum safe following distance?",
			category: "Rules",
			difficulty: "Medium",
			status: "Active",
			successRate: "78%",
			flags: 0,
		},
		{
			id: "Q-1004",
			question: "What does a flashing yellow traffic light indicate?",
			category: "Traffic Signals",
			difficulty: "Easy",
			status: "Active",
			successRate: "88%",
			flags: 0,
		},
		{
			id: "Q-1005",
			question: "When may you legally drive across a double line?",
			category: "Road Markings",
			difficulty: "Hard",
			status: "Flagged",
			successRate: "45%",
			flags: 3,
		},
	];

	return (
		<div className="container mx-auto p-6">
			<DashboardHeader
				title="Admin Dashboard"
				subtitle="Manage users, content, and view analytics"
			/>

			{/* Stats Cards - Always Visible */}
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

			<NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />

			<div className="mt-6">
				{activeTab === "overview" && (
					<OverviewTab
						formData={formData}
						handleChange={handleChange}
						handleSubmit={handleSubmit}
					/>
				)}

				{activeTab === "users" && (
					<UsersTab usersData={usersData} getStatusIcon={getStatusIcon} />
				)}

				{activeTab === "content" && (
					<ContentTab
						contentData={contentData}
						getStatusIcon={getStatusIcon}
						getCategoryBadge={getCategoryBadge}
						getDifficultyBadge={getDifficultyBadge}
					/>
				)}

				{activeTab === "reports" && <ReportsTab />}
			</div>
		</div>
	);
}

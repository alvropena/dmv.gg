export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ClipboardList, MessageSquare, Users } from "lucide-react";
import { AdminHeader } from "@/components/AdminHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentActivityList } from "@/components/RecentActivityList";
import { IssuesCard } from "@/components/IssuesCard";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { QuickActions } from "@/components/QuickActions";
import { UsersTab } from "@/components/UsersTab";
import { ReportsTab } from "@/components/ReportsTab";
import { TestsTab } from "@/components/TestsTab";
import { QuestionsTab } from "@/components/QuestionsTab";
import { SupportTab } from "@/components/SupportTab";
import { getDashboardStats } from "@/app/actions/stats";

export default async function AdminPage({
	searchParams,
}: {
	searchParams: { timeHorizon?: string };
}) {
	const { userId } = await auth();

	if (!userId) {
		redirect("/sign-in");
	}

	// Get the user from the database
	const user = await db.user.findUnique({
		where: {
			clerkId: userId,
		},
		select: {
			role: true,
		},
	});

	// Only allow ADMIN role to access this page
	if (!user || user.role !== "ADMIN") {
		redirect("/");
	}

	const timeHorizon = searchParams.timeHorizon || "1d";
	const stats = await getDashboardStats(timeHorizon);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<AdminHeader />
			<div className="flex">
				<main className="flex-1 p-6">
					<div className="space-y-6">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								Admin Dashboard
							</h1>
							<p className="text-muted-foreground">
								Manage your DMV Knowledge Test platform
							</p>
						</div>

						{/* Stats Overview */}
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<StatCard
								title="Total Users"
								value={stats.totalUsers.toLocaleString()}
								change={stats.changes.users.change}
								trend={stats.changes.users.trend}
								icon={<Users className="h-5 w-5" />}
							/>
							<StatCard
								title="Active Tests"
								value={stats.activeTests.toLocaleString()}
								change={stats.changes.activeTests.change}
								trend={stats.changes.activeTests.trend}
								icon={<ClipboardList className="h-5 w-5" />}
							/>
							<StatCard
								title="Pass Rate"
								value={`${stats.passRate}%`}
								change={stats.changes.passRate.change}
								trend={stats.changes.passRate.trend}
								icon={<AlertCircle className="h-5 w-5" />}
							/>
							<StatCard
								title="Support Tickets"
								value={stats.supportTickets.toLocaleString()}
								change={stats.changes.supportTickets.change}
								trend={stats.changes.supportTickets.trend}
								icon={<MessageSquare className="h-5 w-5" />}
							/>
						</div>

						{/* Main Content Tabs */}
						<Tabs defaultValue="overview">
							<TabsList className="grid w-full grid-cols-6 lg:w-auto">
								<TabsTrigger value="overview">Overview</TabsTrigger>
								<TabsTrigger value="users">Users</TabsTrigger>
								<TabsTrigger value="tests">Tests</TabsTrigger>
								<TabsTrigger value="questions">Questions</TabsTrigger>
								<TabsTrigger value="support">Support</TabsTrigger>
								<TabsTrigger value="reports">Reports</TabsTrigger>
							</TabsList>

							{/* Overview Tab */}
							<TabsContent value="overview" className="space-y-4 mt-4">
								<div className="grid gap-4 md:grid-cols-2">
									{/* Recent Activity */}
									<Card>
										<CardHeader>
											<CardTitle className="flex items-center justify-between">
												<span>Recent Activity</span>
												<Button variant="outline" size="sm">
													View All
												</Button>
											</CardTitle>
										</CardHeader>
										<CardContent>
											<RecentActivityList />
										</CardContent>
									</Card>

									{/* Issues Requiring Attention */}
									<IssuesCard />
								</div>

								{/* Performance Metrics */}
								<PerformanceMetrics timeHorizon={timeHorizon} />

								{/* Quick Actions */}
								<QuickActions />
							</TabsContent>

							{/* Users Tab */}
							<UsersTab />

							{/* Tests Tab */}
							<TabsContent value="tests" className="space-y-4 mt-4">
								<TestsTab />
							</TabsContent>

							{/* Questions Tab */}
							<QuestionsTab />

							{/* Support Tab */}
							<SupportTab />

							{/* Reports Tab */}
							<ReportsTab />
						</Tabs>
					</div>
				</main>
			</div>
		</div>
	);
}

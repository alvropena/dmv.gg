"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentActivityList } from "@/components/RecentActivityList";
import { IssuesCard } from "@/components/IssuesCard";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { QuickActions } from "@/components/QuickActions";
import { UsersTab } from "@/components/UsersTab";
import { TestsTab } from "@/components/TestsTab";
import { QuestionsTab } from "@/components/QuestionsTab";
import { SupportTab } from "@/components/SupportTab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdminTabsProps {
	defaultTab: string;
	timeHorizon: string;
}

export function AdminTabs({ defaultTab, timeHorizon }: AdminTabsProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleTabChange = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("tab", value);
		router.push(`/admin?${params.toString()}`);
	};

	return (
		<Tabs defaultValue={defaultTab} onValueChange={handleTabChange}>
			<TabsList className="grid w-full grid-cols-5 lg:w-auto">
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="users">Users</TabsTrigger>
				<TabsTrigger value="tests">Tests</TabsTrigger>
				<TabsTrigger value="questions">Questions</TabsTrigger>
				<TabsTrigger value="support">Support</TabsTrigger>
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
		</Tabs>
	);
}

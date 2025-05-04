"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getPerformanceMetrics } from "@/app/actions/metrics";
import { useEffect, useState } from "react";

export function PerformanceMetrics({
	timeHorizon = "30d",
}: { timeHorizon?: string }) {
	const [metrics, setMetrics] = useState<{
		userEngagement: { value: number; change: number };
		contentCompletion: { value: number; change: number };
		firstTimePassRate: { value: number; change: number };
	} | null>(null);

	useEffect(() => {
		async function loadMetrics() {
			const data = await getPerformanceMetrics(timeHorizon);
			setMetrics(data);
		}
		loadMetrics();
	}, [timeHorizon]);

	if (!metrics) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Platform Performance</CardTitle>
					<CardDescription>Loading metrics...</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6 md:grid-cols-3">
						{["user-engagement", "content-completion", "first-time-pass"].map(
							(key) => (
								<div key={key} className="space-y-2">
									<div className="h-4 w-24 bg-muted animate-pulse rounded" />
									<div className="h-2 w-full bg-muted animate-pulse rounded" />
									<div className="h-3 w-32 bg-muted animate-pulse rounded" />
								</div>
							),
						)}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Platform Performance</CardTitle>
				<CardDescription>Key metrics for the past 30 days</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-6 md:grid-cols-3">
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<h4 className="text-sm font-medium">User Engagement</h4>
							<span
								className={`text-sm font-medium ${metrics.userEngagement.change >= 0 ? "text-green-600" : "text-amber-600"}`}
							>
								{metrics.userEngagement.change >= 0 ? "+" : ""}
								{metrics.userEngagement.change}%
							</span>
						</div>
						<div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
							<div
								className="h-full bg-blue-600 transition-all duration-500 rounded-full"
								style={{ width: `${metrics.userEngagement.value}%` }}
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							{metrics.userEngagement.value}% of users complete at least one
							test per week
						</p>
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<h4 className="text-sm font-medium">Content Completion</h4>
							<span
								className={`text-sm font-medium ${metrics.contentCompletion.change >= 0 ? "text-green-600" : "text-amber-600"}`}
							>
								{metrics.contentCompletion.change >= 0 ? "+" : ""}
								{metrics.contentCompletion.change}%
							</span>
						</div>
						<div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
							<div
								className="h-full bg-blue-600 transition-all duration-500 rounded-full"
								style={{ width: `${metrics.contentCompletion.value}%` }}
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							{metrics.contentCompletion.value}% of users complete all study
							materials
						</p>
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<h4 className="text-sm font-medium">First-Time Pass Rate</h4>
							<span
								className={`text-sm font-medium ${metrics.firstTimePassRate.change >= 0 ? "text-green-600" : "text-amber-600"}`}
							>
								{metrics.firstTimePassRate.change >= 0 ? "+" : ""}
								{metrics.firstTimePassRate.change}%
							</span>
						</div>
						<div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
							<div
								className="h-full bg-blue-600 transition-all duration-500 rounded-full"
								style={{ width: `${metrics.firstTimePassRate.value}%` }}
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							{metrics.firstTimePassRate.value}% of users pass their DMV test on
							first attempt
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

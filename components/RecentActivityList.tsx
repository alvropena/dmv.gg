"use client";

import {
	ClipboardList,
	Flag,
	MessageSquare,
	User,
	UserPlus,
} from "lucide-react";
import type { Activity, ActivityType } from "@/app/actions/activities";
import { getRecentActivities } from "@/app/actions/activities";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export function RecentActivityList() {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadActivities() {
			try {
				const data = await getRecentActivities();
				setActivities(data);
			} catch (error) {
				console.error("Failed to load activities:", error);
			} finally {
				setIsLoading(false);
			}
		}

		loadActivities();
	}, []);

	if (isLoading) {
		return (
			<div className="space-y-4">
				{["a", "b", "c", "d", "e"].map((val) => (
					<div
						key={`loading-${val}`}
						className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
					>
						<div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
						<div className="space-y-2 flex-1">
							<div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
							<div className="h-3 w-1/4 bg-muted rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{activities.slice(0, 5).map((activity) => (
				<div
					key={activity.id}
					className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
				>
					<ActivityIcon type={activity.type} />
					<div>
						<ActivityContent activity={activity} />
						<p className="text-xs text-muted-foreground mt-1">
							{formatDistanceToNow(activity.createdAt, { addSuffix: true })}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}

function ActivityIcon({ type }: { type: ActivityType }) {
	switch (type) {
		case "user_registered":
			return (
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
					<UserPlus className="h-4 w-4" />
				</div>
			);
		case "test_completed":
			return (
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
					<ClipboardList className="h-4 w-4" />
				</div>
			);
		case "question_flagged":
			return (
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
					<Flag className="h-4 w-4" />
				</div>
			);
		case "support_ticket":
			return (
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
					<MessageSquare className="h-4 w-4" />
				</div>
			);
		default:
			return (
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400">
					<User className="h-4 w-4" />
				</div>
			);
	}
}

function ActivityContent({ activity }: { activity: Activity }) {
	switch (activity.type) {
		case "user_registered":
			return (
				<p className="text-sm">
					<span className="font-medium">{activity.user?.name}</span> registered
					a new account
				</p>
			);
		case "test_completed":
			return (
				<p className="text-sm">
					<span className="font-medium">{activity.user?.name}</span> completed{" "}
					<span className="font-medium">{activity.test?.title}</span> with a
					score of <span className="font-medium">{activity.test?.score}%</span>
				</p>
			);
		case "question_flagged":
			return (
				<p className="text-sm">
					<span className="font-medium">{activity.user?.name}</span> flagged
					question{" "}
					<span className="font-medium">
						{activity.question?.content.slice(0, 50)}...
					</span>
				</p>
			);
		case "support_ticket":
			return (
				<p className="text-sm">
					<span className="font-medium">{activity.user?.name}</span> opened
					support ticket{" "}
					<span className="font-medium">{activity.supportTicket?.subject}</span>
				</p>
			);
		default:
			return <p className="text-sm">Unknown activity</p>;
	}
}

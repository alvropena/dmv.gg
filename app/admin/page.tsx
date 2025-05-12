export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
	AlertCircle,
	ClipboardList,
	MessageSquare,
	Users,
	CreditCard,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { getDashboardStats } from "@/app/actions/stats";
import { AdminTimeHorizonBar } from "@/components/admin/AdminTimeHorizonBar";
import { validateAdmin } from "@/lib/auth";

export default async function AdminPage({
	searchParams,
}: {
	searchParams: { timeHorizon?: string; tab?: string };
}) {
	const validation = await validateAdmin();

	if (validation.error) {
		redirect("/sign-in");
	}

	const timeHorizon = searchParams.timeHorizon || "all";
	const defaultTab = searchParams.tab || "overview";
	const stats = await getDashboardStats(timeHorizon);
	const subscriptionsCount = await db.subscription.count();

	return (
		<div className="space-y-6">
			<AdminTimeHorizonBar />

			{/* Stats Overview */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
					title="Subscriptions"
					value={subscriptionsCount.toLocaleString()}
					icon={<CreditCard className="h-5 w-5" />}
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
			<AdminTabs defaultTab={defaultTab} timeHorizon={timeHorizon} />
		</div>
	);
}

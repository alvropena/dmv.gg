export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  AlertCircle,
  ClipboardList,
  MessageSquare,
  Users,
  CreditCard,
} from "lucide-react";
import { AdminHeader } from "@/components/AdminHeader";
import { StatCard } from "@/components/StatCard";
import { AdminTabs } from "@/components/AdminTabs";
import { getDashboardStats } from "@/app/actions/stats";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { timeHorizon?: string; tab?: string };
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
  const defaultTab = searchParams.tab || "overview";
  const stats = await getDashboardStats(timeHorizon);
  const subscriptionsCount = await db.subscription.count();

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
        </main>
      </div>
    </div>
  );
}

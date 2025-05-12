"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, Suspense } from "react";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import CreatorsTabContent from "@/components/CreatorsTabContent";
import FacelessContentTab from "@/components/FacelessContentTab";
import { EmailTabContent } from "@/components/EmailTabContent";
import { Skeleton } from "@/components/ui/skeleton";

function MarketingPageSkeleton() {
	return (
		<div className="flex flex-col gap-8">
			<Tabs defaultValue="calendar">
				<TabsList>
					<TabsTrigger value="calendar" disabled>
						<Skeleton className="h-4 w-16" />
					</TabsTrigger>
					<TabsTrigger value="creators" disabled>
						<Skeleton className="h-4 w-16" />
					</TabsTrigger>
					<TabsTrigger value="faceless" disabled>
						<Skeleton className="h-4 w-16" />
					</TabsTrigger>
					<TabsTrigger value="email" disabled>
						<Skeleton className="h-4 w-16" />
					</TabsTrigger>
				</TabsList>
				<TabsContent value="calendar">
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<Skeleton className="h-8 w-32" />
							<Skeleton className="h-8 w-24" />
						</div>
						<div className="grid grid-cols-7 gap-4">
							{Array.from({ length: 7 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-6 w-full" />
									<div className="space-y-1">
										<Skeleton className="h-16 w-full" />
										<Skeleton className="h-16 w-full" />
										<Skeleton className="h-16 w-full" />
									</div>
								</div>
							))}
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function MarketingContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const tab = searchParams.get("tab") || "calendar";

	const handleTabChange = useCallback(
		(value: string) => {
			const params = new URLSearchParams(Array.from(searchParams.entries()));
			params.set("tab", value);
			router.replace(`?${params.toString()}`);
		},
		[router, searchParams],
	);

	return (
		<div className="flex flex-col gap-8">
			<Tabs value={tab} onValueChange={handleTabChange}>
				<TabsList>
					<TabsTrigger value="calendar">Calendar</TabsTrigger>
					<TabsTrigger value="creators">Creators</TabsTrigger>
					<TabsTrigger value="faceless">Faceless</TabsTrigger>
					<TabsTrigger value="email">Email</TabsTrigger>
				</TabsList>
				<TabsContent value="calendar">
					<WeeklyCalendar />
				</TabsContent>
				<TabsContent value="creators">
					<CreatorsTabContent />
				</TabsContent>
				<TabsContent value="faceless">
					<FacelessContentTab />
				</TabsContent>
				<TabsContent value="email">
					<EmailTabContent />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default function MarketingPage() {
	return (
		<Suspense fallback={<MarketingPageSkeleton />}>
			<MarketingContent />
		</Suspense>
	);
}

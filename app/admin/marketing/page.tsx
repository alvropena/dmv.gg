"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import CreatorsTabContent from "@/components/CreatorsTabContent";
import FacelessContentTab from "@/components/FacelessContentTab";
import EmailTabContent from "@/components/EmailTabContent";

export default function MarketingPage() {
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

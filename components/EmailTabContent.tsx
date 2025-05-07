"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface DripStep {
	id: string;
	delay: number;
	content: string;
	subject: string;
}

interface Campaign {
	id: string;
	name: string;
	status: string;
	createdAt: string;
	type: string;
	active: boolean;
	sentCount: number;
	succeededCount: number;
	failedCount: number;
	from: string;
	segment: string;
	subject: string;
	content: string;
	dripSequence: DripStep[];
	scheduleType: 'immediate' | 'scheduled' | 'triggered';
	schedule?: {
		date: string;
		time: string;
	};
	triggerEvent?: string;
}

export function EmailTabContent() {
	const router = useRouter();
	const [campaigns, setCampaigns] = useState<Campaign[]>([]);
	const [activeTab, setActiveTab] = useState("campaigns");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const handleAddCampaign = (campaign: Campaign) => {
		setCampaigns((prev) => [campaign, ...prev]);
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Email Marketing</h2>
				<div className="flex gap-2">
					<Button onClick={() => router.push('/email')}>
						Create Campaign
					</Button>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Email Campaigns</CardTitle>
				</CardHeader>
				<CardContent>
					{campaigns.length === 0 ? (
						<p>Your email campaigns will be displayed here.</p>
					) : (
						<div className="space-y-2">
							{campaigns.map((c, i) => (
								<div key={i} className="border rounded p-2">
									<div className="flex items-center justify-between">
										<div className="font-semibold">
											{c.name}{" "}
											<span className="text-xs text-muted-foreground">
												({c.status})
											</span>
										</div>
										<div className="flex items-center gap-4">
											<div className="flex items-center gap-1">
												<span className="text-xs">Active</span>
												<Switch checked={c.status === "active"} onCheckedChange={(checked) => {
													setCampaigns(prev => prev.map((camp, idx) => idx === i ? { ...camp, status: checked ? "active" : "inactive" } : camp));
												}} />
											</div>
											<div className="text-xs">Sent: {c.sentCount}</div>
											<div className="text-xs text-green-600">Succeeded: {c.succeededCount}</div>
											<div className="text-xs text-red-600">Failed: {c.failedCount}</div>
										</div>
									</div>
									<div className="text-sm text-muted-foreground">
										Created At: {c.createdAt}
									</div>
									<div className="text-sm">Subject: {c.subject}</div>
									<div className="text-sm mt-2">
										<div className="font-medium mb-1">Content:</div>
										<div className="border rounded bg-muted p-2 overflow-x-auto prose prose-sm max-w-[500px]" dangerouslySetInnerHTML={{ __html: c.content }} />
									</div>
									{c.type === "drip" && c.dripSequence && (
										<div className="mt-2">
											<div className="font-semibold text-xs mb-1">Drip Sequence:</div>
											<ol className="list-decimal ml-4">
												{c.dripSequence.map((step, idx) => (
													<li key={idx} className="mb-1">
														<div className="text-xs font-medium">Subject: {step.subject}</div>
														<div className="text-xs">Delay: {step.delay}</div>
														<div className="text-xs">Content: {step.content}</div>
													</li>
												))}
											</ol>
										</div>
									)}
									<div className="text-xs text-muted-foreground mt-1">
										{c.scheduleType === "scheduled" && c.schedule && (
											<>Scheduled: {c.schedule.date} at {c.schedule.time}</>
										)}
										{c.scheduleType === "triggered" && c.triggerEvent && (
											<>Trigger: {c.triggerEvent.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { EmailCampaign } from "@/types";
import { Pencil } from "lucide-react";
import { Eye } from "lucide-react";
import { EmailPreviewDialog } from "@/components/EmailPreviewDialog";

export function EmailTabContent() {
	const router = useRouter();
	const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchCampaigns() {
			try {
				const res = await fetch("/api/email/campaigns");
				if (!res.ok) throw new Error("Failed to fetch campaigns");
				const data = await res.json();
				setCampaigns(data);
			} catch (err: unknown) {
				if (err instanceof Error) setError(err.message);
				else setError("Unknown error");
			} finally {
				setLoading(false);
			}
		}
		fetchCampaigns();
	}, []);

	const handleEdit = (campaign: EmailCampaign) => {
		router.push(`/email?id=${campaign.id}`);
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Email Marketing</h2>
				<div className="flex gap-2">
					<Button onClick={() => router.push("/email")}>Add Campaign</Button>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Email Campaigns</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<p>Loading campaigns...</p>
					) : error ? (
						<p className="text-red-600">{error}</p>
					) : campaigns.length === 0 ? (
						<p>Your email campaigns will be displayed here.</p>
					) : (
						<div className="space-y-2">
							{campaigns.map((c) => (
								<div key={c.id} className="border rounded p-2">
									<div className="flex items-center justify-between">
										<div className="font-semibold">
											{c.name}{" "}
											<span className="text-xs text-muted-foreground">
												({c.status})
											</span>
										</div>
										<div className="flex items-center gap-4">
											<Button
												size="icon"
												variant="outline"
												onClick={() => handleEdit(c)}
											>
												<Pencil className="w-4 h-4" />
											</Button>
											<EmailPreviewDialog campaign={c}>
												<Button size="icon" variant="outline">
													<Eye className="w-4 h-4" />
												</Button>
											</EmailPreviewDialog>
											<div className="flex items-center gap-1">
												<span className="text-xs">Active</span>
												<Switch checked={c.active} onCheckedChange={() => {}} />
											</div>
											<div className="text-xs">
												Sent: {c.sentEmails?.length ?? 0}
											</div>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-2 text-sm">
										<div>
											<div className="text-muted-foreground">Description:</div>
											<div>{c.description || "No description"}</div>
										</div>
										<div>
											<div className="text-muted-foreground">From:</div>
											<div>{c.from}</div>
										</div>
										<div>
											<div className="text-muted-foreground">Type:</div>
											<div>{c.type}</div>
										</div>
										<div>
											<div className="text-muted-foreground">
												Schedule Type:
											</div>
											<div>{c.scheduleType}</div>
										</div>
										<div>
											<div className="text-muted-foreground">Trigger Type:</div>
											<div>{c.triggerType || "None"}</div>
										</div>
										<div>
											<div className="text-muted-foreground">
												Recipient Segment:
											</div>
											<div>{c.recipientSegment}</div>
										</div>
										<div>
											<div className="text-muted-foreground">
												Scheduled For:
											</div>
											<div>
												{c.scheduledFor
													? new Date(c.scheduledFor).toLocaleString()
													: "Not scheduled"}
											</div>
										</div>
										<div>
											<div className="text-muted-foreground">Created At:</div>
											<div>{new Date(c.createdAt).toLocaleString()}</div>
										</div>
									</div>
									<div className="text-sm mt-2">
										<div className="font-medium mb-1">Subject:</div>
										<div>{c.subject}</div>
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

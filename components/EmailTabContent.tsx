"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { EmailCampaign } from "@/types";
import CampaignCard from "@/components/CampaignCard";
import CreateCampaignCard from "@/components/CreateCampaignCard";
import { EmailCampaignsSkeleton } from "@/components/EmailCampaignsSkeleton";

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

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-2xl font-bold">Email Marketing</h2>
					<p className="text-muted-foreground text-sm mt-1">
						Manage and monitor your email marketing campaigns
					</p>
				</div>
				<div className="flex gap-2">
					<Button onClick={() => router.push("/create-email-campaign")}>
						Add Campaign
					</Button>
				</div>
			</div>

			{loading ? (
				<EmailCampaignsSkeleton />
			) : error ? (
				<p className="text-red-600">{error}</p>
			) : (
				<div className="space-y-2">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{campaigns.map((c) => (
							<CampaignCard
								key={c.id}
								title={c.name}
								description={c.description ?? undefined}
								isDraft={c.status === "draft"}
								type={c.type}
								triggerType={c.triggerType || "None"}
								subject={c.subject}
								recipientSegment={c.recipientSegment}
								createdAt={new Date(c.createdAt).toLocaleString()}
								isActive={c.active}
								sentCount={c.sentEmails?.length ?? 0}
								campaign={c}
							/>
						))}
						<CreateCampaignCard />
					</div>
				</div>
			)}
		</div>
	);
}

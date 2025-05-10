"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import {
	CampaignType,
	ScheduleType,
	EmailTriggerType,
	RecipientSegment,
} from "@prisma/client";
import type { SentEmail } from "@/types";
import { EmailFormSkeleton } from "@/components/EmailFormSkeleton";
import { FormField } from "@/components/email-campaign/FormField";
import { SelectField } from "@/components/email-campaign/FormField";
import { EmailContentEditor } from "@/components/email-campaign/EmailContentEditor";

const CAMPAIGN_TYPES = [
	{ value: CampaignType.ONE_TIME, label: "One-time" },
	{ value: CampaignType.RECURRING, label: "Recurring" },
	{ value: CampaignType.AB_TEST, label: "A/B Test" },
];

const RECIPIENT_SEGMENTS = [
	{ value: RecipientSegment.ALL_USERS, label: "All Users" },
	{ value: RecipientSegment.TEST_USERS, label: "Test Users" },
	{ value: RecipientSegment.INDIVIDUAL_USERS, label: "Individual Users" },
];

const TRIGGER_EVENTS = [
	{ value: EmailTriggerType.USER_SIGNUP, label: "User Signup" },
	{ value: EmailTriggerType.PURCHASE_COMPLETED, label: "Purchase Completed" },
	{ value: EmailTriggerType.TEST_INCOMPLETE, label: "Test Incomplete" },
];

const SENDER_OPTIONS = [
	{ value: "support@dmv.gg", label: "Susan from DMV.gg <support@dmv.gg>" },
	{ value: "noreply@dmv.gg", label: "DMV.gg <noreply@dmv.gg>" },
];

const SCHEDULE_TYPES = [
	{ value: "schedule", label: "Schedule" },
	{ value: "trigger", label: "Trigger" },
];

// Campaign type for campaign creation
export interface Campaign {
	name: string;
	type: string;
	from: string;
	segment: string;
	subject: string;
	content: string;
	schedule: string;
	scheduleType: string;
	recipientEmails: string[];
	dripSequence: {
		id: string;
		subject: string;
		content: string;
		delay: string;
	}[];
	triggerEvent: string;
	active: boolean;
	sentCount: number;
	succeededCount: number;
	failedCount: number;
	description: string;
}

export default function EmailPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const campaignId = searchParams.get("id");
	const [loading, setLoading] = useState(!!campaignId);
	const [formData, setFormData] = useState<Campaign>({
		name: "",
		type: CampaignType.ONE_TIME,
		from: "support@dmv.gg",
		segment: RecipientSegment.ALL_USERS,
		subject: "",
		content: "",
		schedule: "",
		scheduleType: "schedule",
		recipientEmails: [],
		dripSequence: [
			{ id: crypto.randomUUID(), subject: "", content: "", delay: "" },
		],
		triggerEvent: EmailTriggerType.USER_SIGNUP,
		active: true,
		sentCount: 0,
		succeededCount: 0,
		failedCount: 0,
		description: "",
	});
	const [wordWrap, setWordWrap] = useState(true);

	useEffect(() => {
		async function fetchCampaign() {
			if (!campaignId) return;

			try {
				const response = await fetch(`/api/email/campaigns/${campaignId}`);
				if (!response.ok) throw new Error("Failed to fetch campaign");

				const campaign = await response.json();
				setFormData({
					name: campaign.name,
					type: campaign.type,
					from: campaign.from,
					segment: campaign.recipientSegment,
					subject: campaign.subject,
					content: campaign.content,
					schedule: campaign.scheduledFor
						? new Date(campaign.scheduledFor).toISOString().slice(0, 16)
						: "",
					scheduleType: campaign.scheduleType.toLowerCase(),
					recipientEmails: campaign.recipientEmails || [],
					dripSequence: [
						{ id: crypto.randomUUID(), subject: "", content: "", delay: "" },
					],
					triggerEvent: campaign.triggerType || EmailTriggerType.USER_SIGNUP,
					active: campaign.active,
					sentCount: campaign.sentEmails?.length || 0,
					succeededCount:
						campaign.sentEmails?.filter((e: SentEmail) => e.status === "sent")
							.length || 0,
					failedCount:
						campaign.sentEmails?.filter((e: SentEmail) => e.status === "failed")
							.length || 0,
					description: campaign.description || "",
				});
			} catch (error) {
				console.error("Error fetching campaign:", error);
				// Handle error (show toast, etc.)
			} finally {
				setLoading(false);
			}
		}

		fetchCampaign();
	}, [campaignId]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleRecipientEmailsChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const emails = e.target.value
			.split(",")
			.map((email) => email.trim())
			.filter((email) => email);
		setFormData((prev) => ({ ...prev, recipientEmails: emails }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const url = campaignId
				? `/api/email/campaigns/${campaignId}`
				: "/api/email/campaigns";

			const method = campaignId ? "PATCH" : "POST";

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: formData.name,
					description: formData.description,
					subject: formData.subject,
					content: formData.content,
					scheduleType:
						formData.scheduleType === "trigger"
							? ScheduleType.TRIGGER
							: ScheduleType.SCHEDULE,
					triggerType:
						formData.scheduleType === "trigger" ? formData.triggerEvent : null,
					scheduledFor:
						formData.scheduleType === "schedule" ? formData.schedule : null,
					type: formData.type,
					recipientSegment: formData.segment,
					recipientEmails: formData.recipientEmails,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to save campaign");
			}

			router.push("/admin/marketing?tab=email");
		} catch (error) {
			console.error("Error saving campaign:", error);
			// Handle error (show toast, etc.)
		}
	};

	const handleToggleWordWrap = () => {
		setWordWrap((prev) => !prev);
	};

	return (
		<div className="w-full py-8 bg-[#F1F1EF] min-h-screen">
			<div className="px-8">
				<div className="flex items-center gap-4 mb-6">
					<Button
						variant="outline"
						size="icon"
						onClick={() => router.push("/admin/marketing?tab=email")}
						className="hover:bg-transparent"
					>
						<X className="h-6 w-6" />
					</Button>
					<h1 className="text-3xl font-bold">
						{campaignId ? "Edit Campaign" : "Create New Campaign"}
					</h1>
				</div>
				<p className="text-muted-foreground mb-8">
					{campaignId
						? "Edit your email marketing campaign settings."
						: "Set up a new email marketing campaign. Fields will adjust based on campaign type."}
				</p>

				{loading ? (
					<EmailFormSkeleton />
				) : (
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-2 gap-6">
							<FormField
								label="Campaign Name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								required
							/>
							<SelectField
								label="Campaign Type"
								name="type"
								value={formData.type}
								onValueChange={(v) => handleSelectChange("type", v)}
								options={CAMPAIGN_TYPES}
								placeholder="Select campaign type"
							/>
						</div>

						<FormField
							label="Description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							type="textarea"
							placeholder="Enter a description for this campaign"
							className="min-h-[100px] bg-white"
						/>

						<div className="grid grid-cols-2 gap-6">
							<SelectField
								label="From"
								name="from"
								value={formData.from}
								onValueChange={(v) => handleSelectChange("from", v)}
								options={SENDER_OPTIONS}
								placeholder="Select sender email"
							/>
							<SelectField
								label="Recipient Segment"
								name="segment"
								value={formData.segment}
								onValueChange={(v) => handleSelectChange("segment", v)}
								options={RECIPIENT_SEGMENTS}
								placeholder="Select segment"
							/>
						</div>

						{formData.segment === RecipientSegment.INDIVIDUAL_USERS && (
							<FormField
								label="Recipient Emails"
								name="recipientEmails"
								value={formData.recipientEmails.join(", ")}
								onChange={handleRecipientEmailsChange}
								type="textarea"
								placeholder="Enter email addresses separated by commas"
								className="min-h-[100px] bg-white"
							/>
						)}

						{formData.type === "triggered" && (
							<FormField
								label="Trigger Event"
								name="triggerEvent"
								value={formData.triggerEvent}
								onChange={handleChange}
								placeholder="e.g. User Signup, Purchase"
								required
							/>
						)}

						{formData.type !== "drip" && (
							<div className="space-y-4">
								<FormField
									label="Subject"
									name="subject"
									value={formData.subject}
									onChange={handleChange}
									required
								/>
								<EmailContentEditor
									content={formData.content}
									onChange={(value) =>
										setFormData((prev) => ({ ...prev, content: value }))
									}
									wordWrap={wordWrap}
									onToggleWordWrap={handleToggleWordWrap}
								/>
							</div>
						)}

						<div className="grid grid-cols-2 gap-6">
							<SelectField
								label="Schedule Type"
								name="scheduleType"
								value={formData.scheduleType}
								onValueChange={(v) => handleSelectChange("scheduleType", v)}
								options={SCHEDULE_TYPES}
								placeholder="Select schedule type"
							/>

							{formData.scheduleType === "schedule" && (
								<FormField
									label="Send Date & Time"
									name="schedule"
									value={formData.schedule}
									onChange={handleChange}
									type="datetime-local"
									required
								/>
							)}

							{formData.scheduleType === "trigger" && (
								<SelectField
									label="Trigger Condition"
									name="triggerEvent"
									value={formData.triggerEvent}
									onValueChange={(v) => handleSelectChange("triggerEvent", v)}
									options={TRIGGER_EVENTS}
									placeholder="Select trigger condition"
								/>
							)}
						</div>

						<div className="flex justify-end space-x-4 pt-6">
							<Button
								variant="outline"
								type="button"
								onClick={() => window.history.back()}
							>
								Cancel
							</Button>
							<Button type="submit">
								{campaignId ? "Save Changes" : "Create Campaign"}
							</Button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}

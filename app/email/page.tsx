"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { useRouter, useSearchParams } from "next/navigation";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Paintbrush, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import DOMPurify from "dompurify";
import {
	CampaignType,
	ScheduleType,
	EmailTriggerType,
	RecipientSegment,
} from "@/types";
import type { SentEmail } from "@/types";
import { EditorView } from "@codemirror/view";

const CAMPAIGN_TYPES = [
	{ value: CampaignType.ONE_TIME, label: "One-time" },
	{ value: CampaignType.DRIP, label: "Drip" },
	{ value: CampaignType.REMINDER, label: "Reminder" },
	{ value: CampaignType.TRIGGERED, label: "Triggered" },
	{ value: CampaignType.RECURRING, label: "Recurring" },
	{ value: CampaignType.AB_TEST, label: "A/B Test" },
];

const RECIPIENT_SEGMENTS = [
	{ value: RecipientSegment.ALL_USERS, label: "All Users" },
	{ value: RecipientSegment.NEW_SIGNUPS, label: "New Signups" },
	{ value: RecipientSegment.VIP_USERS, label: "VIPs" },
	{ value: RecipientSegment.INACTIVE_USERS, label: "Inactive Users" },
];

const TRIGGER_EVENTS = [
	{ value: EmailTriggerType.USER_SIGNUP, label: "User Signup" },
	{ value: EmailTriggerType.PURCHASE_COMPLETED, label: "Purchase Completed" },
	{ value: EmailTriggerType.CART_ABANDONED, label: "Cart Abandoned" },
	{ value: EmailTriggerType.PROFILE_UPDATED, label: "Profile Updated" },
	{ value: EmailTriggerType.TEST_INCOMPLETE, label: "Test Incomplete" },
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

	const previewRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (previewRef.current) {
			const sampleFirstName = "Alex";
			const previewHtml = (formData.content || "").replace(
				/\{\{firstName\}\}/g,
				sampleFirstName,
			);
			previewRef.current.innerHTML = DOMPurify.sanitize(
				previewHtml ||
					'<div class="text-muted-foreground">Preview will appear here...</div>',
			);
		}
	}, [formData.content]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleDripChange = (
		idx: number,
		field: "subject" | "content" | "delay",
		value: string,
	) => {
		setFormData((prev) => {
			const dripSequence = [...prev.dripSequence];
			dripSequence[idx][field] = value;
			return { ...prev, dripSequence };
		});
	};

	const addDripStep = () => {
		setFormData((prev) => ({
			...prev,
			dripSequence: [
				...prev.dripSequence,
				{ id: crypto.randomUUID(), subject: "", content: "", delay: "" },
			],
		}));
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
					<div className="flex items-center justify-center h-64">
						<p>Loading campaign data...</p>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="name">Campaign Name</Label>
								<Input
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="type">Campaign Type</Label>
								<Select
									value={formData.type}
									onValueChange={(v) => handleSelectChange("type", v)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select campaign type" />
									</SelectTrigger>
									<SelectContent>
										{CAMPAIGN_TYPES.map((type) => (
											<SelectItem key={type.value} value={type.value}>
												{type.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								name="description"
								value={formData.description}
								onChange={handleChange}
								placeholder="Enter a description for this campaign"
								className="min-h-[100px] bg-white"
							/>
						</div>

						<div className="grid grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="from">From</Label>
								<Select
									value={formData.from}
									onValueChange={(v) => handleSelectChange("from", v)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select sender email" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="support@dmv.gg">
											Susan from DMV.gg &lt;support@dmv.gg&gt;
										</SelectItem>
										<SelectItem value="noreply@dmv.gg">
											DMV.gg &lt;noreply@dmv.gg&gt;
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="segment">Recipient Segment</Label>
								<Select
									value={formData.segment}
									onValueChange={(v) => handleSelectChange("segment", v)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select segment" />
									</SelectTrigger>
									<SelectContent>
										{RECIPIENT_SEGMENTS.map((seg) => (
											<SelectItem key={seg.value} value={seg.value}>
												{seg.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Drip sequence fields */}
						{formData.type === "drip" && (
							<div className="space-y-4">
								<Label htmlFor="drip-sequence">Drip Sequence</Label>
								{formData.dripSequence.map((step, idx) => (
									<div
										key={step.id}
										className="border p-4 rounded-lg space-y-4"
									>
										<h3 className="font-medium">Step {idx + 1}</h3>
										<Input
											name={`drip-subject-${idx}`}
											value={step.subject}
											onChange={(e) =>
												handleDripChange(idx, "subject", e.target.value)
											}
											placeholder="Subject"
											required
										/>
										<Textarea
											name={`drip-content-${idx}`}
											value={step.content}
											onChange={(e) =>
												handleDripChange(idx, "content", e.target.value)
											}
											placeholder="Content"
											required
										/>
										<Input
											name={`drip-delay-${idx}`}
											value={step.delay}
											onChange={(e) =>
												handleDripChange(idx, "delay", e.target.value)
											}
											placeholder="Delay after previous (e.g. 2 days)"
											required
										/>
									</div>
								))}
								<Button type="button" variant="outline" onClick={addDripStep}>
									+ Add Step
								</Button>
							</div>
						)}

						{/* Trigger event field */}
						{formData.type === "triggered" && (
							<div className="space-y-2">
								<Label htmlFor="triggerEvent">Trigger Event</Label>
								<Input
									name="triggerEvent"
									value={formData.triggerEvent}
									onChange={handleChange}
									placeholder="e.g. User Signup, Purchase"
									required
								/>
							</div>
						)}

						{/* Standard subject/content for non-drip */}
						{formData.type !== "drip" && (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="subject">Subject</Label>
									<Input
										name="subject"
										value={formData.subject}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="space-y-2">
									<div className="flex items-center mb-2">
										<Label htmlFor="content">
											Email Content{" "}
											<span className="text-xs text-muted-foreground">
												(HTML supported)
											</span>
										</Label>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														type="button"
														size="icon"
														variant="outline"
														onClick={handleToggleWordWrap}
													>
														<Paintbrush
															className="w-4 h-4"
															style={{ opacity: wordWrap ? 1 : 0.4 }}
														/>
													</Button>
												</TooltipTrigger>
												<TooltipContent side="top" align="center">
													{wordWrap ? "Disable word wrap" : "Enable word wrap"}
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="border rounded-lg h-[600px] bg-white flex flex-col overflow-hidden">
											<div className="flex-1 overflow-auto">
												<CodeMirror
													value={formData.content}
													height="100%"
													minHeight="100%"
													maxHeight="100%"
													extensions={
														wordWrap
															? [html(), EditorView.lineWrapping]
															: [html()]
													}
													theme="light"
													onChange={(value) =>
														setFormData((prev) => ({ ...prev, content: value }))
													}
													basicSetup={{
														lineNumbers: true,
														autocompletion: true,
													}}
													style={{ height: "100%" }}
												/>
											</div>
										</div>
										<div className="border rounded-lg bg-white h-[600px] flex flex-col overflow-hidden">
											<div className="text-sm font-medium p-4 border-b">
												Preview
											</div>
											<div
												ref={previewRef}
												className="prose prose-sm max-w-none flex-1 overflow-auto p-4"
											/>
										</div>
									</div>
								</div>
							</div>
						)}

						<div className="grid grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="scheduleType">Schedule Type</Label>
								<Select
									value={formData.scheduleType}
									onValueChange={(v) => handleSelectChange("scheduleType", v)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select schedule type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="schedule">Schedule</SelectItem>
										<SelectItem value="trigger">Trigger</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{formData.scheduleType === "schedule" && (
								<div className="space-y-2">
									<Label htmlFor="schedule">Send Date & Time</Label>
									<Input
										type="datetime-local"
										name="schedule"
										value={formData.schedule}
										onChange={handleChange}
										required
									/>
								</div>
							)}

							{formData.scheduleType === "trigger" && (
								<div className="space-y-2">
									<Label htmlFor="triggerEvent">Trigger Condition</Label>
									<Select
										value={formData.triggerEvent}
										onValueChange={(v) => handleSelectChange("triggerEvent", v)}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select trigger condition" />
										</SelectTrigger>
										<SelectContent>
											{TRIGGER_EVENTS.map((event) => (
												<SelectItem key={event.value} value={event.value}>
													{event.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
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

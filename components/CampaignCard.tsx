import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, Clock, Users, MoreHorizontal, Edit, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmailPreviewDialog } from "@/components/dialogs/EmailPreviewDialog";
import type { EmailCampaign } from "@/types";
import { useState } from "react";

interface CampaignCardProps {
	title: string;
	description?: string;
	isDraft: boolean;
	type: string;
	triggerType: string;
	subject: string;
	recipientSegment: string;
	createdAt: string;
	isActive: boolean;
	sentCount: number;
	campaign: EmailCampaign;
}

function CampaignCard({
	title,
	description,
	isDraft,
	type,
	triggerType,
	subject,
	recipientSegment,
	createdAt,
	isActive,
	sentCount,
	campaign,
}: CampaignCardProps) {
	const [previewOpen, setPreviewOpen] = useState(false);
	const router = useRouter();

	return (
		<Card className="overflow-hidden flex flex-col">
			<CardHeader className="pb-4">
				<div className="flex justify-between items-start">
					<div className="space-y-1">
						<CardTitle className="flex items-center gap-2">
							{title}
							{isDraft && (
								<Badge variant="outline" className="text-xs font-normal">
									Draft
								</Badge>
							)}
						</CardTitle>
						<CardDescription className="line-clamp-2">
							{description}
						</CardDescription>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() =>
									router.push(`/create-email-campaign?id=${campaign.id}`)
								}
							>
								<Edit className="mr-2 h-4 w-4" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setPreviewOpen(true)}>
								<Eye className="mr-2 h-4 w-4" />
								Preview
							</DropdownMenuItem>
							<DropdownMenuItem className="text-destructive">
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>
			<CardContent className="pb-4 flex-1">
				<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Mail className="h-3.5 w-3.5" />
						Type
					</div>
					<div className="font-medium">{type}</div>

					<div className="flex items-center gap-2 text-muted-foreground">
						<Clock className="h-3.5 w-3.5" />
						Trigger
					</div>
					<div className="font-medium">{triggerType}</div>

					<div className="flex items-center gap-2 text-muted-foreground">
						<Users className="h-3.5 w-3.5" />
						Recipients
					</div>
					<div className="font-medium">{recipientSegment}</div>
				</div>

				<div className="mt-4 pt-4 border-t">
					<h4 className="text-sm font-medium mb-1">Subject</h4>
					<p className="text-sm text-muted-foreground line-clamp-1">
						{subject}
					</p>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between items-center border-t pt-4 bg-muted/50">
				<div className="text-xs text-muted-foreground">
					Created: {createdAt}
				</div>
				<div className="flex items-center gap-3">
					<div className="text-xs">Sent: {sentCount}</div>
					<div className="flex items-center gap-2">
						<Switch id={`active-${title}`} checked={isActive} />
						<label htmlFor={`active-${title}`} className="text-xs font-medium">
							Active
						</label>
					</div>
				</div>
			</CardFooter>
			<EmailPreviewDialog
				campaign={campaign}
				open={previewOpen}
				onOpenChange={setPreviewOpen}
			/>
		</Card>
	);
}

export default CampaignCard;

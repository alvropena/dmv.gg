import type * as React from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import DOMPurify from "dompurify";
import type { EmailCampaign } from "@/types";

interface EmailPreviewDialogProps {
	campaign: EmailCampaign;
	children: React.ReactNode;
}

export function EmailPreviewDialog({
	campaign,
	children,
}: EmailPreviewDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Email Preview</DialogTitle>
				</DialogHeader>
				<div className="mb-4">
					<div className="font-medium mb-1">Subject:</div>
					<div>{campaign.subject}</div>
				</div>
				<div className="border rounded bg-muted p-2 overflow-x-auto prose prose-sm max-w-full">
					{/* eslint-disable-next-line react/no-danger */}
					<div
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(campaign.content),
						}}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}

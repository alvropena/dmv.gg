import type React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface NotificationsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const NotificationsDialog: React.FC<NotificationsDialogProps> = ({
	open,
	onOpenChange,
}) => {
	// Email Notifications
	const [emailMarketing, setEmailMarketing] = useState(true);
	const [emailUpdates, setEmailUpdates] = useState(true);
	const [emailSecurity, setEmailSecurity] = useState(true);

	// Product Notifications
	const [testReminders, setTestReminders] = useState(true);
	const [studyTips, setStudyTips] = useState(true);
	const [progressUpdates, setProgressUpdates] = useState(true);
	const [weakAreasAlerts, setWeakAreasAlerts] = useState(true);

	// Marketing Preferences
	const [promotionalEmails, setPromotionalEmails] = useState(true);
	const [newsletter, setNewsletter] = useState(true);

	const [isLoading, setIsLoading] = useState(false);

	// Fetch initial preferences when dialog opens
	useEffect(() => {
		if (open) {
			const fetchPreferences = async () => {
				try {
					const response = await fetch("/api/user/notifications");
					if (response.ok) {
						const data = await response.json();
						// Email Notifications
						setEmailMarketing(data.emailMarketing);
						setEmailUpdates(data.emailUpdates);
						setEmailSecurity(data.emailSecurity);
						// Product Notifications
						setTestReminders(data.testReminders);
						setStudyTips(data.studyTips);
						setProgressUpdates(data.progressUpdates);
						setWeakAreasAlerts(data.weakAreasAlerts);
						// Marketing Preferences
						setPromotionalEmails(data.promotionalEmails);
						setNewsletter(data.newsletter);
					}
				} catch (error) {
					console.error("Error fetching notification preferences:", error);
					toast.error("Failed to load notification preferences");
				}
			};
			fetchPreferences();
		}
	}, [open]);

	const handleSave = async () => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/user/notifications", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					// Email Notifications
					emailMarketing,
					emailUpdates,
					emailSecurity,
					// Product Notifications
					testReminders,
					studyTips,
					progressUpdates,
					weakAreasAlerts,
					// Marketing Preferences
					promotionalEmails,
					newsletter,
				}),
			});

			if (response.ok) {
				toast.success("Notification preferences saved successfully");
				onOpenChange(false);
			} else {
				toast.error("Failed to save notification preferences");
			}
		} catch (error) {
			console.error("Error saving notification preferences:", error);
			toast.error("An error occurred while saving preferences");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] w-[90%] mx-auto rounded-md">
				<DialogHeader>
					<DialogTitle>Notification Preferences</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-6 py-4">
					{/* Email Notifications */}
					<div className="space-y-4">
						<h3 className="font-semibold text-sm">Email Notifications</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label htmlFor="email-marketing">Marketing Emails</Label>
								<Switch
									id="email-marketing"
									checked={emailMarketing}
									onCheckedChange={setEmailMarketing}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="email-updates">Product Updates</Label>
								<Switch
									id="email-updates"
									checked={emailUpdates}
									onCheckedChange={setEmailUpdates}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="email-security">Security Alerts</Label>
								<Switch
									id="email-security"
									checked={emailSecurity}
									onCheckedChange={setEmailSecurity}
								/>
							</div>
						</div>
					</div>

					<Separator />

					{/* Product Notifications */}
					<div className="space-y-4">
						<h3 className="font-semibold text-sm">Product Notifications</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label htmlFor="test-reminders">Test Reminders</Label>
								<Switch
									id="test-reminders"
									checked={testReminders}
									onCheckedChange={setTestReminders}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="study-tips">Study Tips</Label>
								<Switch
									id="study-tips"
									checked={studyTips}
									onCheckedChange={setStudyTips}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="progress-updates">Progress Updates</Label>
								<Switch
									id="progress-updates"
									checked={progressUpdates}
									onCheckedChange={setProgressUpdates}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="weak-areas">Weak Areas Alerts</Label>
								<Switch
									id="weak-areas"
									checked={weakAreasAlerts}
									onCheckedChange={setWeakAreasAlerts}
								/>
							</div>
						</div>
					</div>

					<Separator />

					{/* Marketing Preferences */}
					<div className="space-y-4">
						<h3 className="font-semibold text-sm">Marketing Preferences</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label htmlFor="promotional-emails">Promotional Emails</Label>
								<Switch
									id="promotional-emails"
									checked={promotionalEmails}
									onCheckedChange={setPromotionalEmails}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="newsletter">Newsletter</Label>
								<Switch
									id="newsletter"
									checked={newsletter}
									onCheckedChange={setNewsletter}
								/>
							</div>
						</div>
					</div>
				</div>
				<DialogFooter className="flex flex-col gap-2">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						type="button"
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button type="submit" onClick={handleSave} disabled={isLoading}>
						{isLoading ? "Saving..." : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default NotificationsDialog;

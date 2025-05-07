"use client";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { SupportRequest } from "@/types";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import { isEqual } from "lodash";
import { useToast } from "@/hooks/use-toast";

interface EditSupportDialogProps {
	open: boolean;
	ticket: SupportRequest | null;
	onOpenChange: (open: boolean) => void;
}

export function EditSupportDialog({
	open,
	ticket,
	onOpenChange,
}: EditSupportDialogProps) {
	const [form, setForm] = useState<SupportRequest | null>(ticket);
	const [initialTicket, setInitialTicket] = useState<SupportRequest | null>(
		ticket,
	);
	const [saving, setSaving] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		setForm(ticket);
		setInitialTicket(ticket);
	}, [ticket]);

	const isChanged =
		form &&
		initialTicket &&
		!isEqual(
			{
				...form,
				createdAt: undefined,
				updatedAt: undefined,
			},
			{
				...initialTicket,
				createdAt: undefined,
				updatedAt: undefined,
			},
		);

	const handleSave = async () => {
		if (!form || !isChanged) return;

		try {
			setSaving(true);
			const response = await fetch(`/api/support/${form.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					status: form.status,
					resolution: form.resolution,
					adminNotes: form.adminNotes,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update support ticket");
			}

			const data = await response.json();
			setForm(data.supportRequest);
			setInitialTicket(data.supportRequest);

			toast({
				title: "Success",
				description: "Support ticket updated successfully",
			});
		} catch (error) {
			console.error("Error updating support ticket:", error);
			toast({
				title: "Error",
				description: "Failed to update support ticket",
				variant: "destructive",
			});
		} finally {
			setSaving(false);
		}
	};

	if (!form) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Support Ticket</DialogTitle>
					<DialogDescription>Update ticket details below.</DialogDescription>
				</DialogHeader>
				<form className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<Label>ID</Label>
						<div className="text-sm text-muted-foreground">{form.id}</div>
					</div>
					<div className="flex flex-col gap-1">
						<Label>User</Label>
						<div className="text-sm text-muted-foreground">
							{form.user
								? `${form.user.firstName} ${form.user.lastName} (${form.user.email})`
								: form.email || "Anonymous"}
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<Label>Message</Label>
						<Textarea
							value={form.message}
							onChange={(e) =>
								setForm((f) => f && { ...f, message: e.target.value })
							}
							readOnly
							disabled
							className="min-h-[100px]"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label>Status</Label>
						<Select
							value={form.status}
							onValueChange={(value) =>
								setForm((f) => f && { ...f, status: value })
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="open">Open</SelectItem>
								<SelectItem value="in_progress">In Progress</SelectItem>
								<SelectItem value="resolved">Resolved</SelectItem>
								<SelectItem value="closed">Closed</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1">
						<Label>Resolution</Label>
						<Textarea
							value={form.resolution || ""}
							onChange={(e) =>
								setForm((f) => f && { ...f, resolution: e.target.value })
							}
							placeholder="Enter resolution details..."
							className="min-h-[100px]"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label>Admin Notes</Label>
						<Textarea
							value={form.adminNotes || ""}
							onChange={(e) =>
								setForm((f) => f && { ...f, adminNotes: e.target.value })
							}
							placeholder="Enter admin notes..."
							className="min-h-[100px]"
						/>
					</div>
					<div className="flex flex-row gap-4">
						<div className="flex flex-col gap-1 w-1/2">
							<Label>Created At</Label>
							<div className="text-sm text-muted-foreground">
								{new Date(form.createdAt).toLocaleString("en-US", {
									month: "long",
									day: "numeric",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</div>
						</div>
						<div className="flex flex-col gap-1 w-1/2">
							<Label>Updated At</Label>
							<div className="text-sm text-muted-foreground">
								{new Date(form.updatedAt).toLocaleString("en-US", {
									month: "long",
									day: "numeric",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</div>
						</div>
					</div>
				</form>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Cancel
						</Button>
					</DialogClose>
					<Button
						type="submit"
						disabled={!isChanged || saving}
						onClick={handleSave}
					>
						{saving ? "Saving..." : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

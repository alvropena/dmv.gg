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
import type { User } from "@/types";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import { isEqual } from "lodash";

interface EditUserDialogProps {
	open: boolean;
	user: User | null;
	onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({
	open,
	user,
	onOpenChange,
}: EditUserDialogProps) {
	const [form, setForm] = useState<User | null>(user);
	const [showCalendar, setShowCalendar] = useState(false);
	const [initialUser, setInitialUser] = useState<User | null>(user);

	useEffect(() => {
		setForm(user);
		setInitialUser(user);
	}, [user]);

	const isChanged =
		form &&
		initialUser &&
		!isEqual(
			{
				...form,
				createdAt: undefined,
				updatedAt: undefined,
			},
			{
				...initialUser,
				createdAt: undefined,
				updatedAt: undefined,
			},
		);

	if (!form) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
					<DialogDescription>Update user details below.</DialogDescription>
				</DialogHeader>
				<form className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<Label>ID</Label>
						<Input value={form.id} readOnly disabled />
					</div>
					<div className="flex flex-col gap-1">
						<Label>Clerk ID</Label>
						<Input value={form.clerkId} readOnly disabled />
					</div>
					<div className="flex flex-col gap-1">
						<Label>Email</Label>
						<Input
							value={form.email}
							onChange={(e) =>
								setForm((f) => f && { ...f, email: e.target.value })
							}
							readOnly
							disabled
						/>
					</div>
					<div className="flex flex-row gap-4">
						<div className="flex flex-col gap-1 w-1/2">
							<Label>First Name</Label>
							<Input
								value={form.firstName ?? ""}
								onChange={(e) =>
									setForm((f) => f && { ...f, firstName: e.target.value })
								}
							/>
						</div>
						<div className="flex flex-col gap-1 w-1/2">
							<Label>Last Name</Label>
							<Input
								value={form.lastName ?? ""}
								onChange={(e) =>
									setForm((f) => f && { ...f, lastName: e.target.value })
								}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<Label>Birthday</Label>
						<div>
							<Input
								readOnly
								className="cursor-pointer"
								value={
									form.birthday
										? format(new Date(form.birthday), "MMMM d, yyyy")
										: ""
								}
								onClick={() => setShowCalendar((v) => !v)}
								placeholder="Select date"
							/>
							{showCalendar && (
								<div className="absolute z-50 mt-2 bg-white rounded-md shadow-md">
									<Calendar
										mode="single"
										selected={
											form.birthday ? new Date(form.birthday) : undefined
										}
										onSelect={(date) => {
											setForm((f) => f && { ...f, birthday: date ?? null });
											setShowCalendar(false);
										}}
									/>
								</div>
							)}
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<Label>Role</Label>
						<Select
							value={form.role}
							onValueChange={(value) =>
								setForm((f) => f && { ...f, role: value as User["role"] })
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ADMIN">ADMIN</SelectItem>
								<SelectItem value="STUDENT">STUDENT</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1">
						<Label>Has Used Free Test</Label>
						<Select
							value={form.hasUsedFreeTest ? "true" : "false"}
							onValueChange={(value) =>
								setForm((f) => f && { ...f, hasUsedFreeTest: value === "true" })
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select option" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="true">True</SelectItem>
								<SelectItem value="false">False</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-row gap-4">
						<div className="flex flex-col gap-1 w-1/2">
							<Label>Created At</Label>
							<Input
								value={format(new Date(form.createdAt), "MMMM d, yyyy, h:mm a")}
								readOnly
								disabled
							/>
						</div>
						<div className="flex flex-col gap-1 w-1/2">
							<Label>Updated At</Label>
							<Input
								value={format(new Date(form.updatedAt), "MMMM d, yyyy, h:mm a")}
								readOnly
								disabled
							/>
						</div>
					</div>
				</form>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Cancel
						</Button>
					</DialogClose>
					<Button type="submit" disabled={!isChanged}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

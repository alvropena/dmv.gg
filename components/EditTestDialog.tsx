import type { Test, TestType } from "@/types";
import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { isEqual } from "lodash";

function formatStatus(status: string): string {
	switch (status) {
		case "in_progress":
			return "In Progress";
		case "completed":
			return "Completed";
		case "abandoned":
			return "Abandoned";
		default:
			return status;
	}
}

interface EditTestDialogProps {
	test: Test | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditTestDialog({
	test,
	open,
	onOpenChange,
}: EditTestDialogProps) {
	const [selectedType, setSelectedType] = useState<TestType | "">("");
	const { toast } = useToast();
	const [initialTest, setInitialTest] = useState<Test | null>(test);

	useEffect(() => {
		if (test) {
			setSelectedType(test.type);
			setInitialTest(test);
		}
	}, [test]);

	const isChanged =
		test &&
		initialTest &&
		!isEqual({ type: selectedType }, { type: initialTest.type });

	const handleEditType = async () => {
		if (!test || !selectedType) return;

		try {
			const response = await fetch(`/api/tests/${test.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ type: selectedType }),
			});

			if (!response.ok) throw new Error("Failed to update test");

			toast({
				title: "Success",
				description: "Test type updated successfully",
			});

			onOpenChange(false);
		} catch (error) {
			console.error("Error updating test:", error);
			toast({
				title: "Error",
				description: "Failed to update test type",
				variant: "destructive",
			});
		}
	};

	if (!test) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Test Details</DialogTitle>
				</DialogHeader>
				<div className="space-y-6 py-4">
					<div className="flex flex-col gap-1">
						<Label>ID</Label>
						<Input value={test.id} readOnly disabled />
					</div>

					<div className="flex flex-col gap-1">
						<Label>Type</Label>
						<Select
							value={selectedType}
							onValueChange={(value: TestType) => setSelectedType(value)}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="NEW">New Test</SelectItem>
								<SelectItem value="REVIEW">Review</SelectItem>
								<SelectItem value="WEAK_AREAS">Weak Areas</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-1">
						<Label>Status</Label>
						<Input value={formatStatus(test.status)} readOnly disabled />
					</div>

					<div className="flex flex-row gap-4">
						<div className="flex flex-col gap-1 w-1/2">
							<Label>Questions Answered</Label>
							<Input
								value={
									test.answers
										?.filter((a) => a.selectedAnswer !== null)
										.length.toString() ?? "0"
								}
								readOnly
								disabled
							/>
						</div>
						<div className="flex flex-col gap-1 w-1/2">
							<Label>Total Questions</Label>
							<Input value={test.totalQuestions.toString()} readOnly disabled />
						</div>
					</div>

					<div className="flex flex-col gap-1">
						<Label>Score</Label>
						<Input
							value={test.status === "completed" ? `${test.score}%` : "-"}
							readOnly
							disabled
							className={
								test.status === "completed"
									? test.score >= 89.13
										? "text-green-600"
										: "text-red-600"
									: ""
							}
						/>
					</div>

					<div className="flex flex-col gap-1">
						<Label>Completed</Label>
						<Input
							value={
								test.completedAt
									? new Date(test.completedAt).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})
									: "False"
							}
							readOnly
							disabled
						/>
					</div>

					<div className="flex flex-row gap-4">
						<div className="flex flex-col gap-1 w-1/2">
							<Label>Created At</Label>
							<Input
								value={new Date(test.createdAt).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
								readOnly
								disabled
							/>
						</div>
						<div className="flex flex-col gap-1 w-1/2">
							<Label>Last Updated</Label>
							<Input
								value={new Date(test.updatedAt).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
								readOnly
								disabled
							/>
						</div>
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Cancel
						</Button>
					</DialogClose>
					<Button type="submit" disabled={!isChanged} onClick={handleEditType}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

import type React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreHorizontal, Flag } from "lucide-react";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import { useState } from "react";
import { QuestionForm } from "./QuestionForm";

interface ContentItem {
	id: string;
	question: string;
	category: string;
	difficulty: string;
	status: string;
	successRate: string;
	flags: number;
}

interface ContentTabProps {
	contentData: ContentItem[];
	getStatusIcon: (status: string) => React.ReactNode;
	getCategoryBadge: (category: string) => React.ReactNode;
	getDifficultyBadge: (difficulty: string) => React.ReactNode;
}

export function ContentTab({
	contentData,
	getStatusIcon,
	getCategoryBadge,
	getDifficultyBadge,
}: ContentTabProps) {
	const [formOpen, setFormOpen] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		optionA: "",
		optionB: "",
		optionC: "",
		optionD: "",
		correctAnswer: "",
		explanation: "",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Question submitted:", formData);
		// Here you would typically add the question to your data
		setFormOpen(false);
		setFormData({
			title: "",
			optionA: "",
			optionB: "",
			optionC: "",
			optionD: "",
			correctAnswer: "",
			explanation: "",
		});
	};

	return (
		<div className="mb-6">
			<div className="flex justify-between items-center mb-4">
				<div className="relative w-full max-w-md">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						placeholder="Search content..."
						className="pl-10 pr-4 py-2 w-full"
					/>
				</div>
				<Button
					className="flex items-center gap-1 ml-2"
					onClick={() => setFormOpen(true)}
				>
					<Plus className="h-4 w-4" />
					Add Question
				</Button>
			</div>

			<Card className="overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">ID</TableHead>
							<TableHead className="w-[350px]">Question</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Difficulty</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Success Rate</TableHead>
							<TableHead>Flags</TableHead>
							<TableHead className="w-[50px]" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{contentData.map((item) => (
							<TableRow key={item.id}>
								<TableCell className="font-medium">{item.id}</TableCell>
								<TableCell>
									<div className="truncate max-w-[350px]">{item.question}</div>
								</TableCell>
								<TableCell>{getCategoryBadge(item.category)}</TableCell>
								<TableCell>{getDifficultyBadge(item.difficulty)}</TableCell>
								<TableCell>
									<div
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
											item.status === "Active"
												? "bg-green-100 text-green-800"
												: item.status === "Flagged"
													? "bg-red-100 text-red-800"
													: "bg-gray-100 text-gray-800"
										}`}
									>
										{getStatusIcon(item.status)}
										{item.status}
									</div>
								</TableCell>
								<TableCell>{item.successRate}</TableCell>
								<TableCell>
									{item.flags > 0 ? (
										<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
											<Flag className="h-3 w-3 mr-1" />
											{item.flags}
										</div>
									) : (
										item.flags
									)}
								</TableCell>
								<TableCell>
									<Button variant="ghost" size="icon" className="h-8 w-8">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>

			<QuestionForm
				formData={formData}
				open={formOpen}
				onOpenChange={setFormOpen}
				handleChange={handleChange}
				handleSubmit={handleSubmit}
			/>
		</div>
	);
}

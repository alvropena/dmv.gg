"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

type WeakArea = {
	question: {
		id: string;
		title: string;
		correctAnswer: string;
		explanation: string;
	};
	incorrectCount: number;
};

type WeakAreasProps = {
	isLoading?: boolean;
};

export function WeakAreas({ isLoading = false }: WeakAreasProps) {
	const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [creatingTest, setCreatingTest] = useState<boolean>(false);
	const router = useRouter();

	const fetchWeakAreas = async () => {
		try {
			setLoading(true);
			const response = await fetch(`/api/user/weak-areas?t=${Date.now()}`);

			if (!response.ok) {
				throw new Error("Failed to fetch weak areas");
			}

			const data = await response.json();
			setWeakAreas(data.weakAreas || []);
		} catch (error) {
			console.error("Error fetching weak areas:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchWeakAreas();
	}, []);

	const handleReviewQuestion = async () => {
		if (weakAreas.length === 0) {
			router.push("/test");
			return;
		}

		try {
			setCreatingTest(true);
			const questionIds = weakAreas.map((area) => area.question.id);

			const response = await fetch("/api/tests/custom", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ questionIds }),
			});

			if (!response.ok) {
				throw new Error("Failed to create test");
			}

			const data = await response.json();
			router.push(`/test/${data.test.id}?review=true`);
		} catch (error) {
			console.error("Error creating test for weak areas:", error);
			router.push("/");
		} finally {
			setCreatingTest(false);
		}
	};

	if (loading || isLoading) {
		return (
			<div className="w-full px-4">
				<div className="container mx-auto px-2 md:px-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold">Weak Areas</h2>
					</div>
					<Card className="bg-white dark:bg-slate-950 rounded-xl">
						<CardContent className="pt-6">
							<div className="flex flex-col items-center justify-center py-8 text-center">
								<Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
								<p className="text-muted-foreground">Loading weak areas...</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (weakAreas.length === 0) {
		return (
			<div className="w-full">
				<div className="container mx-auto">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold">Weak Areas</h2>
					</div>
					<Card className="bg-white dark:bg-slate-950 rounded-xl">
						<CardContent className="pt-6">
							<div className="flex flex-col items-center justify-center py-6 text-center">
								<AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
								<p className="text-muted-foreground mb-4">
									Complete more tests to identify your weak areas
								</p>
								<Button
									onClick={handleReviewQuestion}
									variant="outline"
									className="rounded-xl"
								>
									Take a Test
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="container mx-auto">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Weak Areas</h2>
				</div>
				<Card className="bg-white dark:bg-slate-950 rounded-xl">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg">Questions to Review</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{weakAreas.map((weakArea) => (
								<div
									key={weakArea.question.id}
									className="border-b pb-3 last:border-b-0"
								>
									<p className="font-medium text-sm line-clamp-2">
										{weakArea.question.title}
									</p>
									<div className="flex justify-between items-center mt-1">
										<p className="text-xs text-muted-foreground">
											Incorrect {weakArea.incorrectCount} time
											{weakArea.incorrectCount !== 1 ? "s" : ""}
										</p>
									</div>
								</div>
							))}
						</div>

						<Button
							onClick={handleReviewQuestion}
							className="w-full mt-4"
							disabled={creatingTest}
						>
							{creatingTest ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin mr-2" />
									Creating Practice...
								</>
							) : (
								"Practice These Questions"
							)}
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

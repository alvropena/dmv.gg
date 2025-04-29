import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type LastScoreCardProps = {
	lastScore: number;
	isLoading: boolean;
	error: string | null;
};

export function LastScoreCard({
	lastScore,
	isLoading,
	error,
}: LastScoreCardProps) {
	// Calculate number of correct answers based on percentage
	const totalQuestions = 46;
	const correctAnswers = Math.round((lastScore / 100) * totalQuestions);
	const isPassing = correctAnswers >= 39;

	return (
		<div className="rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
			<h3 className="text-xl font-bold">Last Score</h3>
			<div className="mt-2">
				{isLoading ? (
					<div className="flex items-center gap-2">
						<Loader2 className="h-6 w-6 animate-spin text-primary" />
						<span className="text-muted-foreground">Loading stats...</span>
					</div>
				) : error ? (
					<div className="text-red-500 text-sm">{error}</div>
				) : (
					<>
						<span className="text-4xl font-bold">{lastScore}%</span>
						<div className="mt-1">
							<Badge variant={isPassing ? "secondary" : "destructive"}>
								{isPassing ? "Passing" : "Failed"}
							</Badge>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

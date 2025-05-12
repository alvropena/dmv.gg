import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

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
	const errors = totalQuestions - correctAnswers;

	const tooltipText = isPassing
		? `Passed with ${errors} errors (max allowed: 5)`
		: `Failed with ${errors} errors. Max 5 errors allowed out of ${totalQuestions} questions.`;

	return (
		<div className="rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
			<div className="flex items-center gap-3 mb-2">
				{isLoading ? (
					<Skeleton className="h-7 w-32" />
				) : (
					<h3 className="text-xl font-bold">Last Score</h3>
				)}
			</div>
			<div className="mt-2">
				{isLoading ? (
					<>
						<Skeleton className="h-10 w-24" />
						<div className="mt-1">
							<Skeleton className="h-6 w-20 rounded-full" />
						</div>
					</>
				) : error ? (
					<div className="text-red-500 text-sm">{error}</div>
				) : (
					<>
						<span className="text-4xl font-bold">{lastScore}%</span>
						<div className="mt-1">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Badge
											variant={isPassing ? "secondary" : "destructive"}
											className={`rounded-full ${
												isPassing
													? "bg-green-100 hover:bg-green-100 text-green-700 border-green-200 font-normal shadow-none"
													: ""
											}`}
										>
											{isPassing ? "Passing" : "Failed"}
										</Badge>
									</TooltipTrigger>
									<TooltipContent>
										<p>{tooltipText}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

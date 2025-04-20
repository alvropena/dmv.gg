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
	return (
		<div className="rounded-[40px] p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
			<h3 className="text-lg font-medium mb-2">Last Score</h3>
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
							<Badge variant={lastScore >= 70 ? "secondary" : "destructive"}>
								{lastScore >= 70 ? "Passing" : "Failed"}
							</Badge>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

import { Loader2 } from "lucide-react";

type AverageScoreCardProps = {
	averageScore: number;
	scoreDifference: number;
	isLoading: boolean;
	error: string | null;
};

export function AverageScoreCard({
	averageScore,
	scoreDifference,
	isLoading,
	error,
}: AverageScoreCardProps) {
	return (
		<div className="rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
			<h3 className="text-xl font-bold">Average Score</h3>
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
						<span className="text-4xl font-bold">{averageScore}%</span>
						<div className="mt-1 text-sm">
							{scoreDifference > 0 ? (
								<span className="text-green-500">+{scoreDifference}%</span>
							) : scoreDifference < 0 ? (
								<span className="text-red-500">{scoreDifference}%</span>
							) : (
								<span className="text-gray-500">No change</span>
							)}{" "}
							from last test
						</div>
					</>
				)}
			</div>
		</div>
	);
}

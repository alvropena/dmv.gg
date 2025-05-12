import { Skeleton } from "@/components/ui/skeleton";

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
			<div className="flex items-center gap-3 mb-2">
				{isLoading ? (
					<Skeleton className="h-7 w-40" />
				) : (
					<h3 className="text-xl font-bold">Average Score</h3>
				)}
			</div>
			<div className="mt-2">
				{isLoading ? (
					<>
						<Skeleton className="h-10 w-24" />
						<div className="mt-1">
							<Skeleton className="h-4 w-32" />
						</div>
					</>
				) : error ? (
					<div className="text-red-500 text-sm">{error}</div>
				) : (
					<>
						<span className="text-4xl font-bold">{averageScore}%</span>
						<div className="mt-1">
							{scoreDifference > 0 ? (
								<>
									<span className="text-green-500">+{scoreDifference}%</span>
									<span className="text-muted-foreground"> from last test</span>
								</>
							) : scoreDifference < 0 ? (
								<>
									<span className="text-red-500">{scoreDifference}%</span>
									<span className="text-muted-foreground"> from last test</span>
								</>
							) : (
								<>
									<span className="text-muted-foreground">No change</span>
									<span className="text-muted-foreground"> from last test</span>
								</>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}

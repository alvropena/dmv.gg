import { Loader2, Trophy } from "lucide-react";

type TestsCompletedCardProps = {
	totalCompleted: number;
	weeklyDifference: number;
	isLoading: boolean;
	error: string | null;
};

export function TestsCompletedCard({
	totalCompleted,
	weeklyDifference,
	isLoading,
	error,
}: TestsCompletedCardProps) {
	return (
		<div className="w-full">
			<div className="container mx-auto">
				<div className="rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
					<div className="flex items-center gap-3 mb-2">
						<h3 className="text-lg font-medium">Tests Completed</h3>
					</div>
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
								<div className="flex items-center gap-1">
									<Trophy className="h-8 w-8 text-yellow-500" />
									<span className="text-4xl font-bold">{totalCompleted}</span>
								</div>
								<div className="mt-1 text-sm">
									{weeklyDifference > 0 ? (
										<span className="text-green-500">+{weeklyDifference}</span>
									) : weeklyDifference < 0 ? (
										<span className="text-red-500">{weeklyDifference}</span>
									) : (
										<span className="text-gray-500">No change</span>
									)}{" "}
									from last week
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

import { Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
		<div className="rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
			<div className="flex items-center gap-3 mb-2">
				{isLoading ? (
					<Skeleton className="h-7 w-40" />
				) : (
					<h3 className="text-xl font-bold">Tests Completed</h3>
				)}
			</div>
			<div className="mt-2">
				{isLoading ? (
					<>
						<div className="flex items-center gap-1">
							<Skeleton className="h-8 w-8 rounded-full" />
							<Skeleton className="h-10 w-16" />
						</div>
						<div className="mt-1">
							<Skeleton className="h-4 w-32" />
						</div>
					</>
				) : error ? (
					<div className="text-red-500 text-sm">{error}</div>
				) : (
					<>
						<div className="flex items-center gap-1">
							<Trophy className="h-8 w-8 text-yellow-500" />
							<span className="text-4xl font-bold">{totalCompleted}</span>
						</div>
						<div className="mt-1">
							{weeklyDifference > 0 ? (
								<>
									<span className="text-green-500">+{weeklyDifference}</span>
									<span className="text-muted-foreground"> from last week</span>
								</>
							) : weeklyDifference < 0 ? (
								<>
									<span className="text-red-500">{weeklyDifference}</span>
									<span className="text-muted-foreground"> from last week</span>
								</>
							) : (
								<>
									<span className="text-muted-foreground">No change</span>
									<span className="text-muted-foreground"> from last week</span>
								</>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}

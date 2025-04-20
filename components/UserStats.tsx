import { useState, useEffect, useCallback } from "react";
import { TestsCompletedCard } from "./stats/TestsCompletedCard";
import { AverageScoreCard } from "./stats/AverageScoreCard";
import { LastScoreCard } from "./stats/LastScoreCard";
import { useAuthContext } from "@/contexts/AuthContext";

export type UserStats = {
	totalCompleted: number;
	weeklyDifference: number;
	averageScore: number;
	lastScore: number;
	scoreDifference: number;
};

type UserStatsProps = {
	initialStats?: UserStats;
};

export function UserStats({ initialStats }: UserStatsProps) {
	const { dbUser, isLoading: isUserLoading } = useAuthContext();
	const [stats, setStats] = useState<UserStats>(
		initialStats || {
			totalCompleted: 0,
			weeklyDifference: 0,
			averageScore: 0,
			lastScore: 0,
			scoreDifference: 0,
		},
	);
	const [isStatsLoading, setIsStatsLoading] = useState(!initialStats);
	const [statsError, setStatsError] = useState<string | null>(null);

	const fetchUserStats = useCallback(async () => {
		if (initialStats || isUserLoading || !dbUser) return;

		setIsStatsLoading(true);
		setStatsError(null);

		try {
			const response = await fetch("/api/user/stats");

			if (!response.ok) {
				throw new Error("Failed to fetch stats");
			}

			const data = await response.json();

			if (data.stats) {
				setStats(data.stats);
			}
		} catch (error) {
			console.error("Error fetching user stats:", error);
			setStatsError("Failed to load stats. Please try again later.");
		} finally {
			setIsStatsLoading(false);
		}
	}, [initialStats, dbUser, isUserLoading]);

	useEffect(() => {
		fetchUserStats();
	}, [fetchUserStats]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
			<TestsCompletedCard
				totalCompleted={stats.totalCompleted}
				weeklyDifference={stats.weeklyDifference}
				isLoading={isStatsLoading || isUserLoading}
				error={statsError}
			/>

			<AverageScoreCard
				averageScore={stats.averageScore}
				scoreDifference={stats.scoreDifference}
				isLoading={isStatsLoading || isUserLoading}
				error={statsError}
			/>

			<LastScoreCard
				lastScore={stats.lastScore}
				isLoading={isStatsLoading || isUserLoading}
				error={statsError}
			/>
		</div>
	);
}

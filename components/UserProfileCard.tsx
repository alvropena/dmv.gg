import type { UserResource } from "@clerk/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Loader2, Gift } from "lucide-react";

type UserProfileCardProps = {
	user: UserResource;
};

type UserStatsData = {
	studyStreak: number;
};

export function UserProfileCard({ user }: UserProfileCardProps) {
	const { dbUser, hasActiveSubscription } = useAuthContext();
	const [stats, setStats] = useState<UserStatsData>({
		studyStreak: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [userBirthday, setUserBirthday] = useState<string | null>(null);

	const displayName =
		user.fullName ||
		`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
		"User";
	const initials = displayName
		.split(" ")
		.map((name) => name.charAt(0).toUpperCase())
		.join("");

	useEffect(() => {
		const fetchUserStats = async () => {
			try {
				setIsLoading(true);
				const response = await fetch("/api/user/activity");

				if (!response.ok) {
					throw new Error("Failed to fetch user activity stats");
				}

				const data = await response.json();

				// Get streak directly from the API
				const streak = data.streak || 0;

				setStats({
					studyStreak: streak,
				});
			} catch (error) {
				console.error("Error fetching user stats:", error);
				// Use defaults if there's an error
				setStats({ studyStreak: 0 });
			} finally {
				setIsLoading(false);
			}
		};

		if (hasActiveSubscription) {
			fetchUserStats();
		} else {
			setIsLoading(false);
		}
	}, [hasActiveSubscription]);

	// Update birthday when dbUser changes
	useEffect(() => {
		if (dbUser?.birthday) {
			// Create a new Date object with the UTC time
			const birthdayDate = new Date(dbUser.birthday);
			// Add the timezone offset to get the correct local date
			birthdayDate.setMinutes(
				birthdayDate.getMinutes() + birthdayDate.getTimezoneOffset(),
			);

			const formattedBirthday = birthdayDate.toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
				timeZone: "UTC",
			});
			setUserBirthday(formattedBirthday);
		} else {
			setUserBirthday(null);
		}
	}, [dbUser]);

	return (
		<div className="rounded-lg p-4 mb-6 border border-slate-200 dark:border-slate-800">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Avatar className="h-12 w-12 bg-slate-100 dark:bg-slate-800">
						{user.imageUrl ? (
							<AvatarImage src={user.imageUrl} alt={displayName} />
						) : (
							<AvatarFallback className="text-slate-500">
								{initials}
							</AvatarFallback>
						)}
					</Avatar>
					<div>
						<h3 className="font-medium">{displayName}</h3>
						{userBirthday && (
							<p className="text-xs text-muted-foreground flex items-center gap-1">
								<Gift className="h-3 w-3" />
								{userBirthday}
							</p>
						)}
					</div>
				</div>

				{isLoading ? (
					<div className="flex items-center text-muted-foreground">
						<Loader2 className="h-4 w-4 animate-spin mr-2" />
						<span className="text-sm">Loading stats...</span>
					</div>
				) : (
					<>
						{/* Mobile view */}
						<div className="flex flex-col items-end gap-1 sm:hidden">
							<p className="text-xs">
								Study streak:{" "}
								<span className="font-bold">
									{stats.studyStreak} {stats.studyStreak === 1 ? "day" : "days"}
								</span>
							</p>
						</div>

						{/* Desktop view */}
						<div className="hidden sm:flex gap-6">
							<div className="text-right">
								<p className="text-sm text-muted-foreground">Study streak</p>
								<p className="font-semibold">
									{stats.studyStreak} {stats.studyStreak === 1 ? "day" : "days"}
								</p>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

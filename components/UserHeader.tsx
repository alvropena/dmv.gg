"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { Gift, LogOut, Zap, Star } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { PricingDialog } from "@/components/PricingDialog";
import { SubscriptionDetailsDialog } from "@/components/SubscriptionDetailsDialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function UserHeader() {
	const { signOut } = useClerk();
	const { user } = useUser();
	const { dbUser, hasActiveSubscription } = useAuthContext();
	const [isPricingOpen, setIsPricingOpen] = useState(false);
	const [isSubscriptionDetailsOpen, setIsSubscriptionDetailsOpen] =
		useState(false);
	const [userBirthday, setUserBirthday] = useState<string | null>(null);

	const displayName =
		dbUser?.firstName && dbUser?.lastName
			? `${dbUser.firstName} ${dbUser.lastName}`
			: dbUser?.firstName || "User";

	useEffect(() => {
		if (dbUser?.birthday) {
			const birthdayDate = new Date(dbUser.birthday);
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

	const handlePlanSelect = async (plan: "weekly" | "monthly" | "lifetime") => {
		try {
			const response = await fetch("/api/create-checkout-session", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					plan,
				}),
			});

			const data = await response.json();

			if (data.url) {
				window.location.href = data.url;
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<>
			<header className="w-full z-50 pt-6 md:pt-12 px-2">
				<div className="container mx-auto px-2 md:px-6">
					<div className="flex flex-row justify-between items-center sm:items-center bg-white rounded-xl border shadow-sm px-4 md:px-8 py-3 md:py-4">
						<div className="flex flex-row sm:flex-row items-center gap-4">
							<div>
								<Avatar className="w-12 h-12">
									<AvatarImage src={user?.imageUrl} alt={displayName} />
									<AvatarFallback>
										{displayName?.[0]?.toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</div>
							<div className="flex flex-col items-start">
								<span className="text-base font-medium">{displayName}</span>
								{userBirthday && (
									<span className="text-sm text-muted-foreground flex items-center gap-1">
										<Gift className="h-4 w-4" />
										{userBirthday}
									</span>
								)}
							</div>
						</div>

						<div className="flex flex-row items-center justify-end sm:gap-2">
							{hasActiveSubscription || dbUser?.role === "ADMIN" ? (
								<Button
									onClick={() => setIsSubscriptionDetailsOpen(true)}
									className="flex items-center justify-center gap-2 w-[100px] sm:w-auto bg-fuchsia-500 hover:bg-fuchsia-600 text-white h-9"
								>
									<Star className="h-4 w-4" />
									<span className="inline-flex items-center">Premium</span>
								</Button>
							) : (
								<Button
									onClick={() => setIsPricingOpen(true)}
									className="flex items-center justify-center gap-2 w-[100px] sm:w-auto"
								>
									<Zap className="h-4 w-4" />
									Upgrade
								</Button>
							)}
							<Button
								onClick={() => {
									signOut();
								}}
								className="sm:hidden items-center justify-center"
								variant="ghost"
								size="icon"
							>
								<LogOut className="h-5 w-5 text-red-500" />
							</Button>
							<Button
								onClick={() => {
									signOut();
								}}
								className="hidden sm:flex items-center justify-center gap-2 w-[100px] sm:w-auto bg-red-500 hover:bg-red-600 text-white"
								variant="secondary"
							>
								<LogOut className="h-4 w-4" />
								Logout
							</Button>
						</div>
					</div>
				</div>
			</header>

			<PricingDialog
				isOpen={isPricingOpen}
				onClose={() => setIsPricingOpen(false)}
				onPlanSelect={handlePlanSelect}
			/>
			<SubscriptionDetailsDialog
				isOpen={isSubscriptionDetailsOpen}
				onClose={() => setIsSubscriptionDetailsOpen(false)}
			/>
		</>
	);
}

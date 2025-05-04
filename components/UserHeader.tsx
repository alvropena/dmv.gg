"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { Gift, LogOut, Zap, Star, Crown, Mail } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { PricingDialog } from "@/components/PricingDialog";
import { SubscriptionDetailsDialog } from "@/components/SubscriptionDetailsDialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";

export function UserHeader() {
	const { signOut } = useClerk();
	const { user } = useUser();
	const { dbUser, hasActiveSubscription } = useAuthContext();
	const [isPricingOpen, setIsPricingOpen] = useState(false);
	const [isSubscriptionDetailsOpen, setIsSubscriptionDetailsOpen] =
		useState(false);
	const [userBirthday, setUserBirthday] = useState<string | null>(null);
	const router = useRouter();
	const posthog = usePostHog();
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

	const handleSendWelcomeEmail = async () => {
		try {
			const response = await fetch("/api/email/welcome", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: dbUser?.email,
					firstName: dbUser?.firstName,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to send welcome email");
			}

			// You might want to add a toast notification here
			console.log("Welcome email sent successfully");
		} catch (error) {
			console.error("Error sending welcome email:", error);
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
							{dbUser?.role === "ADMIN" ? (
								<Button
									onClick={() => router.push("/admin")}
									className="flex items-center justify-center gap-2 w-[100px] sm:w-auto bg-zinc-800 hover:bg-zinc-900 text-white h-9"
								>
									<Crown className="h-4 w-4" />
									<span className="inline-flex items-center">Admin</span>
								</Button>
							) : hasActiveSubscription ? (
								<Button
									onClick={() => setIsSubscriptionDetailsOpen(true)}
									className="flex items-center justify-center gap-2 w-[100px] sm:w-auto bg-fuchsia-500 hover:bg-fuchsia-600 text-white h-9"
								>
									<Star className="h-4 w-4" />
									<span className="inline-flex items-center">Premium</span>
								</Button>
							) : (
								<Button
									onClick={() => {
										posthog?.capture("upgrade_button_clicked");
										setIsPricingOpen(true);
									}}
									className="flex items-center justify-center gap-2 w-[100px] sm:w-auto"
								>
									<Zap className="h-4 w-4" />
									Upgrade
								</Button>
							)}
							{dbUser?.role === "ADMIN" && (
								<Button
									onClick={handleSendWelcomeEmail}
									className="flex items-center justify-center gap-2 w-[100px] sm:w-auto bg-blue-500 hover:bg-blue-600 text-white h-9"
								>
									<Mail className="h-4 w-4" />
									<span className="inline-flex items-center">Send Welcome</span>
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
								className="hidden sm:flex items-center justify-center gap-2 w-[100px] sm:w-auto"
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

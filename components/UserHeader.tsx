"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { PricingDialog } from "@/components/dialogs/PricingDialog";
import { SubscriptionDetailsDialog } from "@/components/dialogs/SubscriptionDetailsDialog";
import { usePostHog } from "posthog-js/react";
import Logo from "@/components/Logo";
import UpgradeButton from "@/components/UpgradeButton";
import AvatarDropdown from "@/components/AvatarDropdown";
import SettingsDialog from "@/components/dialogs/SettingsDialog";
import NotificationsDialog from "@/components/dialogs/NotificationsDialog";

export function UserHeader() {
	const { signOut } = useClerk();
	const { user } = useUser();
	const { dbUser, hasActiveSubscription } = useAuthContext();
	const [isPricingOpen, setIsPricingOpen] = useState(false);
	const [isSubscriptionDetailsOpen, setIsSubscriptionDetailsOpen] =
		useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const posthog = usePostHog();

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
			console.error("Error creating checkout session:", error);
		}
	};

	const months = [
		{ value: "1", label: "January" },
		{ value: "2", label: "February" },
		{ value: "3", label: "March" },
		{ value: "4", label: "April" },
		{ value: "5", label: "May" },
		{ value: "6", label: "June" },
		{ value: "7", label: "July" },
		{ value: "8", label: "August" },
		{ value: "9", label: "September" },
		{ value: "10", label: "October" },
		{ value: "11", label: "November" },
		{ value: "12", label: "December" },
	];
	const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) =>
		(currentYear - i).toString(),
	);
	const [settingsDay, setSettingsDay] = useState<string | undefined>(undefined);
	const [settingsMonth, setSettingsMonth] = useState<string | undefined>(
		undefined,
	);
	const [settingsYear, setSettingsYear] = useState<string | undefined>(
		undefined,
	);
	const [gender, setGender] = useState<string | undefined>(undefined);
	const [ethnicity, setEthnicity] = useState<string | undefined>(undefined);
	const [language, setLanguage] = useState<string | undefined>(undefined);

	// Prefill settings birthday fields from dbUser.birthday
	useEffect(() => {
		if (dbUser?.birthday) {
			if (typeof dbUser.birthday === "string") {
				const match = (dbUser.birthday as string).match(
					/^([0-9]{4})-([0-9]{2})-([0-9]{2})/,
				);
				if (match) {
					setSettingsYear(match[1]);
					setSettingsMonth(String(Number(match[2])));
					setSettingsDay(String(Number(match[3])));
					return;
				}
			}
			if (
				dbUser.birthday instanceof Date &&
				!Number.isNaN(dbUser.birthday.getTime())
			) {
				setSettingsDay(dbUser.birthday.getDate().toString());
				setSettingsMonth((dbUser.birthday.getMonth() + 1).toString());
				setSettingsYear(dbUser.birthday.getFullYear().toString());
				return;
			}
			// fallback: try to parse as string if not string or Date
			const str = String(dbUser.birthday);
			const match = str.match(
				/^([0-9]{4})-([0-9]{2})-([0-9]{2})/,
			) as RegExpMatchArray | null;
			if (match) {
				setSettingsYear(match[1]);
				setSettingsMonth(String(Number(match[2])));
				setSettingsDay(String(Number(match[3])));
			}
		}
	}, [dbUser]);

	return (
		<>
			<header className="w-full z-50 pt-6 md:pt-12">
				<div className="container mx-auto px-4 sm:px-6">
					<div className="flex flex-row justify-between items-center sm:items-center bg-white rounded-xl border shadow-sm px-4 py-3 md:py-4">
						<Logo />
						<div className="flex flex-row items-center justify-end sm:gap-2">
							<UpgradeButton
								dbUser={dbUser}
								hasActiveSubscription={hasActiveSubscription}
								posthog={posthog}
								setIsPricingOpen={setIsPricingOpen}
								setIsSubscriptionDetailsOpen={setIsSubscriptionDetailsOpen}
							/>
							<AvatarDropdown
								user={user}
								onSettings={() => setIsSettingsOpen(true)}
								onNotifications={() => setIsNotificationsOpen(true)}
								onLogout={signOut}
							/>
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

			<SettingsDialog
				open={isSettingsOpen}
				onOpenChange={setIsSettingsOpen}
				months={months}
				days={days}
				years={years}
				settingsDay={settingsDay}
				setSettingsDay={setSettingsDay}
				settingsMonth={settingsMonth}
				setSettingsMonth={setSettingsMonth}
				settingsYear={settingsYear}
				setSettingsYear={setSettingsYear}
				gender={gender}
				setGender={setGender}
				ethnicity={ethnicity}
				setEthnicity={setEthnicity}
				language={language}
				setLanguage={setLanguage}
			/>

			<NotificationsDialog
				open={isNotificationsOpen}
				onOpenChange={setIsNotificationsOpen}
			/>
		</>
	);
}

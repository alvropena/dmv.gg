"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState } from "react";
import { PricingDialog } from "@/components/PricingDialog";
import { SubscriptionDetailsDialog } from "@/components/SubscriptionDetailsDialog";
import { usePostHog } from "posthog-js/react";
import Logo from "@/components/Logo";
import UpgradeButton from "@/components/UpgradeButton";
import AvatarDropdown from "@/components/AvatarDropdown";
import SettingsDialog from "@/components/SettingsDialog";

export function UserHeader() {
	const { signOut } = useClerk();
	const { user } = useUser();
	const { dbUser, hasActiveSubscription } = useAuthContext();
	const [isPricingOpen, setIsPricingOpen] = useState(false);
	const [isSubscriptionDetailsOpen, setIsSubscriptionDetailsOpen] =
		useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const posthog = usePostHog();

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
								onLogout={signOut}
							/>
						</div>
					</div>
				</div>
			</header>

			<PricingDialog
				isOpen={isPricingOpen}
				onClose={() => setIsPricingOpen(false)}
				onPlanSelect={() => {}}
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
		</>
	);
}

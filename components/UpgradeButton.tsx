import { Button } from "@/components/ui/button";
import { Crown, Star, Zap } from "lucide-react";
import type { User as DBUser } from "@/types";

interface UpgradeButtonProps {
	dbUser: DBUser | null;
	hasActiveSubscription: boolean;
	posthog: ReturnType<typeof import("posthog-js/react").usePostHog>;
	setIsPricingOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsSubscriptionDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UpgradeButton({
	dbUser,
	hasActiveSubscription,
	posthog,
	setIsPricingOpen,
	setIsSubscriptionDetailsOpen,
}: UpgradeButtonProps) {
	if (dbUser?.role === "ADMIN") {
		return (
			<Button
				onClick={() => {
					if (window.location.hostname === "localhost") {
						window.location.href = "/admin";
					} else {
						window.location.href = "https://admin.dmv.gg";
					}
				}}
				className="flex items-center justify-center gap-2 w-[100px] sm:w-auto bg-zinc-800 hover:bg-zinc-900 text-white h-9"
			>
				<Crown className="h-4 w-4" />
				<span className="inline-flex items-center">Admin</span>
			</Button>
		);
	}
	if (hasActiveSubscription) {
		return (
			<Button
				onClick={() => setIsSubscriptionDetailsOpen(true)}
				className="flex items-center justify-center gap-2 w-[100px] sm:w-auto bg-fuchsia-500 hover:bg-fuchsia-600 text-white h-9"
			>
				<Star className="h-4 w-4" />
				<span className="inline-flex items-center">Premium</span>
			</Button>
		);
	}
	return (
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
	);
}

"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { UserStats } from "@/components/UserStats";
import { StudyTips } from "@/components/StudyTips";
import { UserActivitySection } from "@/components/UserActivitySection";
import { SupportButton } from "@/components/SupportButton";
import { PricingDialog } from "@/components/PricingDialog";
import { BirthdayDialog } from "@/components/BirthdayDialog";
import LandingPage from "@/components/landing";

export default function Home() {
	const [isPricingOpen, setIsPricingOpen] = useState(false);
	const [isBirthdayDialogOpen, setIsBirthdayDialogOpen] = useState(false);

	const { user, isLoaded } = useUser();
	const router = useRouter();
	const { dbUser, isLoading } = useAuthContext();

	// Add handlePlanSelect function
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

	// Check if user has birthday set
	useEffect(() => {
		if (!isLoading && dbUser && !dbUser.birthday) {
			setIsBirthdayDialogOpen(true);
		}
	}, [dbUser, isLoading]);

	// Handle saving birthday
	const handleSaveBirthday = async (birthday: Date) => {
		try {
			const response = await fetch("/api/user/birthday", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ birthday }),
			});

			if (response.ok) {
				setIsBirthdayDialogOpen(false);
				// Force a refresh of the auth context to get the updated user data
				router.refresh();
			}
		} catch (error) {
			console.error("Error saving birthday:", error);
		}
	};

	if (!isLoaded || isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	// Add PricingDialog component that will be used across all views
	const pricingDialog = (
		<PricingDialog
			isOpen={isPricingOpen}
			onClose={() => setIsPricingOpen(false)}
			onPlanSelect={(plan) => {
				handlePlanSelect(plan);
				setIsPricingOpen(false);
			}}
		/>
	);

	// Render dashboard if user is authenticated
	if (user) {
		return (
			<>
				<div className="container mx-auto p-4">
					{/* User profile card */}

					{/* Stats cards */}
					<UserStats />

					{/* User Activity Section */}
					<UserActivitySection />

					{/* Study Tips Section */}
					<StudyTips />
				</div>
				{pricingDialog}
				<BirthdayDialog
					isOpen={isBirthdayDialogOpen}
					onSave={handleSaveBirthday}
					onClose={() => setIsBirthdayDialogOpen(false)}
				/>
				<SupportButton />
			</>
		);
	}

	// If not authenticated, render the landing page
	return <LandingPage />;
}

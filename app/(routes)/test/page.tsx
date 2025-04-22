"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAuthContext } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function TestPage() {
	const router = useRouter();
	const { user, isLoaded } = useUser();
	const { hasActiveSubscription, isLoading } = useAuthContext();
	const [isCreatingTest, setIsCreatingTest] = useState(false);

	// Create a new test and redirect to it
	const createNewTest = useCallback(async () => {
		try {
			setIsCreatingTest(true);
			const response = await fetch("/api/tests", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Failed to create test");
			}

			const data = await response.json();
			router.push(`/test/${data.test.id}`);
		} catch (error) {
			console.error("Error creating new test:", error);
			router.push("/");
		}
	}, [router]);

	useEffect(() => {
		// If user is not authenticated or doesn't have an active subscription,
		// redirect to home page
		if (isLoaded && !isLoading && (!user || !hasActiveSubscription)) {
			router.push("/");
			return;
		}

		// Only create a new test if we haven't already started
		if (!isCreatingTest) {
			createNewTest();
		}
	}, [
		isLoaded,
		isLoading,
		user,
		hasActiveSubscription,
		router,
		isCreatingTest,
		createNewTest,
	]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<Loader2 className="h-8 w-8 animate-spin text-primary" />
		</div>
	);
}

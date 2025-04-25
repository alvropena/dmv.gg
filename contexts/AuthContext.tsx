"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import type { User, AuthContextType } from "@/types";

const AuthContext = createContext<AuthContextType>({
	dbUser: null,
	isLoading: true,
	hasActiveSubscription: false,
	refreshUser: async () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { user } = useUser();
	const [dbUser, setDbUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchUser = async () => {
		if (!user) {
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/auth");
			const data = await response.json();
			setDbUser(data.user);
		} catch (error) {
			console.error("Error fetching user:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, [user]);

	const hasActiveSubscription = Boolean(
		dbUser?.subscriptions?.some(
			(sub) =>
				sub.status === "active" && new Date(sub.currentPeriodEnd) > new Date(),
		),
	);

	return (
		<AuthContext.Provider value={{ dbUser, isLoading, hasActiveSubscription, refreshUser: fetchUser }}>
			{children}
		</AuthContext.Provider>
	);
}

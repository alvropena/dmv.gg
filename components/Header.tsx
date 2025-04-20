"use client";

import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
	Menu,
	Lock,
	FileText,
	Play,
	PlayCircle,
	PlusCircle,
	Gift,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { PricingDialog } from "@/components/PricingDialog";
import { SubscriptionDetailsDialog } from "@/components/SubscriptionDetailsDialog";
import { SignInDialog } from "@/components/SignInDialog";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Test = {
	id: string;
	totalQuestions: number;
	completedQuestions: number;
	correctAnswers: number;
	status: string;
	answers: Array<{
		id: string;
		isCorrect: boolean | null;
	}>;
};

type UserStatsData = {
	studyStreak: number;
};

export function Header() {
	const router = useRouter();
	const { isSignedIn } = useAuth();
	const { dbUser, hasActiveSubscription } = useAuthContext();
	const [isPricingOpen, setIsPricingOpen] = useState(false);
	const [isSubscriptionDetailsOpen, setIsSubscriptionDetailsOpen] =
		useState(false);
	const [isSignInOpen, setIsSignInOpen] = useState(false);
	const [stats, setStats] = useState<UserStatsData>({ studyStreak: 0 });
	const [isLoading, setIsLoading] = useState(true);
	const [userBirthday, setUserBirthday] = useState<string | null>(null);

	const displayName = dbUser?.firstName || "User";
	const initials = displayName
		.split(" ")
		.map((name: string) => name.charAt(0).toUpperCase())
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
				const streak = data.streak || 0;
				setStats({ studyStreak: streak });
			} catch (error) {
				console.error("Error fetching user stats:", error);
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

	const handleLogoClick = (e: React.MouseEvent) => {
		e.preventDefault();
		if (isSignedIn) {
			router.push("/");
		} else {
			router.push("/");
		}
	};

	const handleGetStarted = () => {
		setIsSignInOpen(true);
	};

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

	const NavLinks = () => (
		<>
			<Button
				variant="ghost"
				className="w-full text-lg font-light px-6 py-4 h-auto rounded-full text-center"
				onClick={() => {
					window.location.href = "#features";
				}}
			>
				Features
			</Button>
			<Button
				variant="ghost"
				className="w-full text-lg font-light px-6 py-4 h-auto rounded-full text-center"
				onClick={() => {
					window.location.href = "#pricing";
				}}
			>
				Pricing
			</Button>
			<Button
				variant="ghost"
				className="w-full text-lg font-light px-6 py-4 h-auto rounded-full text-center"
				onClick={() => {
					window.location.href = "#testimonials";
				}}
			>
				Testimonials
			</Button>
			<Button
				variant="ghost"
				className="w-full text-lg font-light px-6 py-4 h-auto rounded-full text-center"
				onClick={() => {
					window.location.href = "#faq";
				}}
			>
				FAQ
			</Button>
		</>
	);

	// Extracted desktop navigation component for signed out users
	const SignedOutDesktopNav = () => (
		<nav className="hidden lg:flex gap-2 ml-8">
			<NavLinks />
		</nav>
	);

	// Extracted desktop call-to-action component for signed out users
	const SignedOutDesktopCTA = () => (
		<div className="hidden lg:flex items-center gap-3">
			<Button
				onClick={handleGetStarted}
				variant="outline"
				className="rounded-full text-lg px-6 py-4 h-auto"
			>
				Log in
			</Button>
			<Button
				onClick={handleGetStarted}
				className="rounded-full text-lg px-6 py-4 h-auto"
			>
				Sign up
			</Button>
		</div>
	);

	// Extracted mobile menu component for signed out users
	const SignedOutMobileMenu = () => (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="lg:hidden">
					<Menu className="h-6 w-6" />
					<span className="sr-only">Toggle menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left">
				<div className="flex flex-col h-full py-6">
					<div className="flex flex-col gap-6 items-center w-full">
						<div className="w-full bg-[#3FA7D6] text-white font-bold px-6 py-4 rounded-full text-lg text-center">
							DMV.gg
						</div>
						<div className="w-full flex flex-col gap-6">
							<NavLinks />
						</div>
					</div>

					<div className="flex-1 flex flex-col justify-center w-full gap-6 my-6">
						<div className="w-full h-[1px] bg-border" />
					</div>

					<div className="w-full">
						<div className="w-full flex flex-col gap-6 items-center">
							<Button
								onClick={handleGetStarted}
								variant="outline"
								className="w-full rounded-full text-lg font-light px-6 py-4 h-auto text-center"
							>
								Log in
							</Button>
							<Button
								onClick={handleGetStarted}
								className="w-full rounded-full text-lg font-light px-6 py-4 h-auto text-center"
							>
								Sign up
							</Button>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);

	// Mobile login button
	const MobileLoginButton = () => (
		<div className="lg:hidden flex items-center gap-2">
			<Button
				onClick={handleGetStarted}
				variant="outline"
				className="rounded-full text-lg px-6 py-4 h-auto"
			>
				Log in
			</Button>
			<Button
				onClick={handleGetStarted}
				className="rounded-full text-lg px-6 py-4 h-auto"
			>
				Sign up
			</Button>
		</div>
	);

	return (
		<>
			<header className="sticky top-0 w-full z-50 p-4 pt-6 md:pt-12">
				<div className="container mx-auto px-2 md:px-6">
					<div className="flex items-center justify-between bg-white rounded-full border shadow-sm px-4 md:px-8 py-3 md:py-4">
						<div className="flex items-center">
							<div className="block lg:hidden">
								<SignedOutMobileMenu />
							</div>

							<Link
								href="/"
								onClick={handleLogoClick}
								className="hidden lg:block"
							>
								<h1 className="flex items-center text-xl md:text-2xl py-1 rounded-full font-bold">
									DMV.gg
								</h1>
							</Link>

							<SignedOut>
								<SignedOutDesktopNav />
							</SignedOut>
						</div>

						<div className="flex items-center gap-3 md:gap-4">
							<SignedOut>
								<SignedOutDesktopCTA />
								<MobileLoginButton />
							</SignedOut>

							<SignedIn>
								<div className="hidden lg:flex items-center gap-4">
									<Avatar className="h-8 w-8 bg-slate-100 dark:bg-slate-800">
										<AvatarFallback className="text-slate-500">
											{initials}
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col">
										<span className="text-sm font-medium">{displayName}</span>
										{userBirthday && (
											<span className="text-xs text-muted-foreground flex items-center gap-1">
												<Gift className="h-3 w-3" />
												{userBirthday}
											</span>
										)}
										{!isLoading && (
											<span className="text-xs text-muted-foreground">
												{stats.studyStreak} day
												{stats.studyStreak !== 1 ? "s" : ""} streak
											</span>
										)}
									</div>
									<UserButton afterSignOutUrl="/" />
								</div>
							</SignedIn>
						</div>
					</div>
				</div>
			</header>

			<SignedIn>
				<UserWelcomeCard />
			</SignedIn>

			<SignInDialog
				isOpen={isSignInOpen}
				onClose={() => setIsSignInOpen(false)}
			/>
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

function UserWelcomeCard() {
	const router = useRouter();
	const { dbUser, hasActiveSubscription } = useAuthContext();
	const [progress, setProgress] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [hasExistingTests, setHasExistingTests] = useState(false);
	const [latestTestId, setLatestTestId] = useState<string | null>(null);
	const [isCreatingTest, setIsCreatingTest] = useState(false);
	const [completedQuestions, setCompletedQuestions] = useState(0);
	const [remainingQuestions, setRemainingQuestions] = useState(0);

	const displayName = dbUser?.firstName || "User";
	const hasAccess = hasActiveSubscription || dbUser?.role === "ADMIN";

	useEffect(() => {
		const fetchUserProgress = async () => {
			try {
				setIsLoading(true);
				const response = await fetch("/api/tests");

				if (!response.ok) {
					throw new Error("Failed to fetch tests");
				}

				const data = await response.json();

				// Get the most recent test
				if (data.tests && data.tests.length > 0) {
					setHasExistingTests(true);
					const latestTest = data.tests[0] as Test;
					setLatestTestId(latestTest.id);

					// Calculate progress based on answered questions
					if (latestTest.totalQuestions > 0) {
						// Count how many questions have been answered (where isCorrect is not null)
						const answeredCount = latestTest.answers.filter(
							(answer) => answer.isCorrect !== null,
						).length;
						const correctCount = latestTest.answers.filter(
							(answer) => answer.isCorrect === true,
						).length;

						setCompletedQuestions(answeredCount);
						setRemainingQuestions(latestTest.totalQuestions - answeredCount);

						// If test is completed, show percentage of correct answers
						if (latestTest.status === "completed") {
							const progressPercentage = Math.round(
								(correctCount / latestTest.totalQuestions) * 100,
							);
							setProgress(progressPercentage);
						}
						// If test is in progress, show percentage of answered questions
						else {
							const progressPercentage = Math.round(
								(answeredCount / latestTest.totalQuestions) * 100,
							);
							setProgress(progressPercentage);
						}
					} else {
						setProgress(0);
						setCompletedQuestions(0);
						setRemainingQuestions(0);
					}
				} else {
					// No tests found
					setHasExistingTests(false);
					setProgress(0);
					setCompletedQuestions(0);
					setRemainingQuestions(0);
				}
			} catch (error) {
				console.error("Error fetching tests:", error);
				setHasExistingTests(false);
				setProgress(0);
				setCompletedQuestions(0);
				setRemainingQuestions(0);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserProgress();
	}, []);

	const handleContinueTest = () => {
		if (!hasAccess) {
			router.push("/pricing");
			return;
		}
		if (latestTestId) {
			router.push(`/test/${latestTestId}`);
		}
	};

	const handleStartNewTest = async () => {
		if (!hasAccess) {
			router.push("/pricing");
			return;
		}

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
		} finally {
			setIsCreatingTest(false);
		}
	};

	return (
		<div className="container mx-auto px-4">
			<div className="rounded-[40px] p-8 mb-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
				<div className="px-1">
					<h2 className="text-2xl font-bold mb-2">
						Welcome back, {displayName}!
					</h2>
					<p className="text-muted-foreground mb-4 text-sm">
						Ready to continue your DMV test preparation? You&apos;re making
						{progress > 0 ? " great" : ""} progress!
					</p>

					<div className="mb-6">
						<div className="flex justify-between mb-2">
							<span className="text-sm">
								Progress:{" "}
								{isLoading ? (
									"Loading..."
								) : (
									<span className="font-bold">
										{completedQuestions} completed, {remainingQuestions} left
									</span>
								)}
							</span>
							<span className="font-bold text-sm">
								{isLoading ? "Loading..." : `${progress}%`}
							</span>
						</div>
						<Progress
							value={isLoading ? 5 : progress}
							className={`h-2.5 ${isLoading ? "animate-pulse" : ""}`}
						/>
					</div>

					<div className="flex flex-col sm:flex-row gap-3">
						{hasExistingTests ? (
							<>
								<Button
									onClick={handleContinueTest}
									className="flex items-center justify-center gap-2 rounded-[40px]"
								>
									{!hasAccess ? (
										<Lock className="h-4 w-4" />
									) : (
										<PlayCircle className="h-4 w-4" />
									)}
									Continue Test
								</Button>
								<Button
									variant="secondary"
									onClick={handleStartNewTest}
									className="flex items-center justify-center gap-2 rounded-[40px]"
									disabled={isCreatingTest}
								>
									{!hasAccess ? (
										<Lock className="h-4 w-4" />
									) : (
										<PlusCircle className="h-4 w-4" />
									)}
									{isCreatingTest ? "Creating..." : "Start New Test"}
								</Button>
							</>
						) : (
							<Button
								variant="secondary"
								onClick={handleStartNewTest}
								className="flex items-center justify-center gap-2 rounded-[40px]"
								disabled={isCreatingTest}
							>
								{!hasAccess ? (
									<Lock className="h-4 w-4" />
								) : (
									<Play className="h-4 w-4" />
								)}
								{isCreatingTest ? "Creating..." : "Start Test"}
							</Button>
						)}
						<Button
							onClick={() => router.push("/handbook")}
							variant="outline"
							className="flex items-center justify-center gap-2 rounded-[40px]"
						>
							<FileText className="h-4 w-4" />
							DMV Handbook
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

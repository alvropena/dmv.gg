"use client";

import { SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
	const router = useRouter();

	const handleSignIn = () => {
		router.push("/sign-in");
	};

	const handleSignUp = () => {
		router.push("/sign-up");
	};

	const NavLinks = () => {
		const router = useRouter();

		const handleNavigation = (path: string) => {
			// If it's a hash link and we're not on the root path
			if (path.startsWith("#") && window.location.pathname !== "/") {
				router.push(`/${path}`);
			} else if (path.startsWith("#")) {
				const element = document.getElementById(path.substring(1));
				if (element) {
					element.scrollIntoView({ behavior: "smooth" });
				}
			} else {
				router.push(path);
			}
		};

		return (
			<>
				<Button
					variant="ghost"
					className="w-full px-6 py-4 h-auto rounded-full text-center text-lg"
					onClick={() => handleNavigation("#features")}
				>
					Features
				</Button>
				<Button
					variant="ghost"
					className="w-full px-6 py-4 h-auto rounded-full text-center text-lg"
					onClick={() => handleNavigation("/pricing")}
				>
					Pricing
				</Button>
				<Button
					variant="ghost"
					className="w-full px-6 py-4 h-auto rounded-full text-center text-lg"
					onClick={() => handleNavigation("#testimonials")}
				>
					Testimonials
				</Button>
				<Button
					variant="ghost"
					className="w-full px-6 py-4 h-auto rounded-full text-center text-lg"
					onClick={() => handleNavigation("#faq")}
				>
					FAQ
				</Button>
			</>
		);
	};

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
				onClick={handleSignIn}
				variant="outline"
				className="rounded-full px-6 py-4 h-auto text-lg"
			>
				Log in
			</Button>
			<Button
				onClick={handleSignUp}
				className="rounded-full px-6 py-4 h-auto text-lg"
			>
				Sign up
			</Button>
		</div>
	);

	// Extracted mobile menu component for signed out users
	const SignedOutMobileMenu = () => (
		<Sheet>
			<SheetTrigger asChild className="lg:hidden">
				<div className="p-2">
					<Menu className="h-6 w-6" />
				</div>
			</SheetTrigger>
			<SheetContent side="left">
				<div className="flex flex-col h-full py-6">
					<div className="flex flex-col gap-6 items-center w-full">
						<div className="w-full bg-[#3FA7D6] text-white font-bold px-6 py-4 rounded-full text-center">
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
								onClick={handleSignIn}
								variant="outline"
								className="w-full rounded-full px-6 py-4 h-auto text-center text-lg"
							>
								Log in
							</Button>
							<Button
								onClick={handleSignUp}
								className="w-full rounded-full px-6 py-4 h-auto text-center text-lg"
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
				onClick={handleSignIn}
				variant="outline"
				className="rounded-full px-6 py-4 h-auto text-lg"
			>
				Log in
			</Button>
			<Button
				onClick={handleSignUp}
				className="rounded-full px-6 py-4 h-auto text-lg"
			>
				Sign up
			</Button>
		</div>
	);

	return (
		<SignedOut>
			<header className="sticky top-0 w-full z-50 p-4 pt-6 md:pt-12">
				<div className="container mx-auto px-2 md:px-6">
					<div className="flex items-center justify-between bg-white rounded-full border shadow-sm px-4 md:px-8 py-3 md:py-4">
						<div className="flex items-center">
							<div className="block lg:hidden">
								<SignedOutMobileMenu />
							</div>
							<div className="hidden lg:block font-bold text-xl mr-8">
								DMV.gg
							</div>
							<SignedOutDesktopNav />
						</div>

						<div className="flex items-center gap-3 md:gap-4">
							<SignedOutDesktopCTA />
							<MobileLoginButton />
						</div>
					</div>
				</div>
			</header>
		</SignedOut>
	);
}

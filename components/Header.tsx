"use client";

import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sparkles, Crown, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState } from "react";
import { PricingDialog } from "@/components/PricingDialog";
import { SubscriptionDetailsDialog } from "@/components/SubscriptionDetailsDialog";
import { SignInDialog } from "@/components/SignInDialog";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { dbUser, hasActiveSubscription } = useAuthContext();
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isSubscriptionDetailsOpen, setIsSubscriptionDetailsOpen] =
    useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

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

  const handleUpgrade = () => {
    setIsPricingOpen(true);
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
        className="text-lg font-light px-6 py-4 h-auto rounded-full"
        onClick={() => window.location.href = '#features'}
      >
        Features
      </Button>
      <Button
        variant="ghost"
        className="text-lg font-light px-6 py-4 h-auto rounded-full"
        onClick={() => window.location.href = '#pricing'}
      >
        Pricing
      </Button>
      <Button
        variant="ghost"
        className="text-lg font-light px-6 py-4 h-auto rounded-full"
        onClick={() => window.location.href = '#testimonials'}
      >
        Testimonials
      </Button>
      <Button
        variant="ghost"
        className="text-lg font-light px-6 py-4 h-auto rounded-full"
        onClick={() => window.location.href = '#faq'}
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
        <div className="flex flex-col justify-end h-full pb-6">
          <div className="flex flex-col gap-6 items-center w-full">
            <NavLinks />
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

  // Extracted status display component for signed in users
  const SignedInUserStatus = () => (
    <div className="hidden lg:flex items-center">
      {hasActiveSubscription || dbUser?.role === "ADMIN" ? (
        <>
          {dbUser?.role === "ADMIN" ? (
            <Badge variant="outline" className="mr-2 font-bold">
              ADMIN
            </Badge>
          ) : (
            <Button
              variant="outline"
              className="mr-2 h-[38px] flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 hover:text-amber-800"
              onClick={() => setIsSubscriptionDetailsOpen(true)}
            >
              <Crown className="h-4 w-4 text-amber-500" />
              <span>Premium</span>
            </Button>
          )}
        </>
      ) : (
        <Button
          onClick={handleUpgrade}
          className="mr-2 h-[38px] bg-amber-500 text-white hover:bg-amber-600"
          variant="default"
        >
          <Sparkles className="h-4 w-4" />
          Upgrade
        </Button>
      )}
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
              
              <Link href="/" onClick={handleLogoClick} className="hidden lg:block">
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
                <SignedInUserStatus />
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

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

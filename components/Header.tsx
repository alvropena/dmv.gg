"use client";

import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Crown, Info } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState } from "react";
import { PricingDialog } from "@/components/PricingDialog";
import { SubscriptionDetailsDialog } from "@/components/SubscriptionDetailsDialog";
import Link from "next/link";


export function Header() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { hasActiveSubscription } = useAuthContext();
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isSubscriptionDetailsOpen, setIsSubscriptionDetailsOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSignedIn) {
      router.push("/");
    } else {
      router.push("/");
    }
  };

  const handleGetStarted = () => {
    router.push("/sign-in");
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

  return (
    <>
      <header className="sticky top-0 w-full z-50 backdrop-blur-md bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" onClick={handleLogoClick}>
              <h1 className="text-xl font-bold bg-blue-600 text-white px-3 py-1 rounded">
                DMV.gg
              </h1>
            </Link>

            <div className="flex items-center gap-2">
              {/* <ThemeToggle /> */}
              <SignedOut>
                <Button onClick={handleGetStarted}>
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </SignedOut>
              <SignedIn>
                {hasActiveSubscription ? (
                  <Button
                    variant="outline"
                    className="mr-2 h-[34px] flex items-center gap-1"
                    onClick={() => setIsSubscriptionDetailsOpen(true)}
                  >
                    <Crown className="h-4 w-4" />
                    <span>Premium</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleUpgrade}
                    className="mr-2 h-[34px]"
                    variant="outline"
                  >
                    <Sparkles className="h-4 w-4" />
                    Upgrade
                  </Button>
                )}
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
        <div className="container mx-auto border-b border-slate-200 dark:border-slate-800" />
      </header>

      <PricingDialog
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onPlanSelect={(plan) => {
          handlePlanSelect(plan);
          setIsPricingOpen(false);
        }}
      />

      <SubscriptionDetailsDialog
        isOpen={isSubscriptionDetailsOpen}
        onClose={() => setIsSubscriptionDetailsOpen(false)}
      />
    </>
  );
}

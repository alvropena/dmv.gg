"use client";

import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Crown, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState } from "react";
import { PricingDialog } from "@/components/PricingDialog";
import { SubscriptionDetailsDialog } from "@/components/SubscriptionDetailsDialog";
import { SignInDialog } from "@/components/SignInDialog";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

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
      <Link
        href="#features"
        className="text-sm font-medium hover:underline underline-offset-4"
      >
        Features
      </Link>
      <Link
        href="#how-it-works"
        className="text-sm font-medium hover:underline underline-offset-4"
      >
        How It Works
      </Link>
      <Link
        href="#pricing"
        className="text-sm font-medium hover:underline underline-offset-4"
      >
        Pricing
      </Link>
      <Link
        href="#testimonials"
        className="text-sm font-medium hover:underline underline-offset-4"
      >
        Testimonials
      </Link>
      <Link
        href="#faq"
        className="text-sm font-medium hover:underline underline-offset-4"
      >
        FAQ
      </Link>
    </>
  );

  return (
    <>
      <header className="sticky top-0 w-full z-50 backdrop-blur-md bg-background/80 border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" onClick={handleLogoClick}>
              <h1 className="text-xl font-bold bg-blue-600 text-white px-3 py-1 rounded">
                DMV.gg
              </h1>
            </Link>

            <SignedOut>
              <nav className="hidden md:flex gap-6">
                <NavLinks />
              </nav>
            </SignedOut>

            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
              <SignedOut>
                <div className="hidden md:block">
                  <Button onClick={handleGetStarted}>
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="hidden md:flex items-center">
                  {hasActiveSubscription || dbUser?.role === "ADMIN" ? (
                    <>
                      {dbUser?.role === "ADMIN" ? (
                        <Badge 
                          variant="outline" 
                          className="mr-2 font-bold"
                        >
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
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-6 mt-8">
                    <SignedOut>
                      <NavLinks />
                    </SignedOut>
                    <SignedIn>
                      {hasActiveSubscription || dbUser?.role === "ADMIN" ? (
                        <>
                          {dbUser?.role === "ADMIN" ? (
                            <Badge 
                              variant="outline" 
                              className="font-bold"
                            >
                              ADMIN
                            </Badge>
                          ) : (
                            <Button
                              variant="outline"
                              className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 hover:text-amber-800"
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
                          className="bg-amber-500 text-white hover:bg-amber-600"
                          variant="default"
                        >
                          <Sparkles className="h-4 w-4" />
                          Upgrade
                        </Button>
                      )}
                    </SignedIn>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
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

      <SignInDialog
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </>
  );
}

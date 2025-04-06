"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { questions } from "@/data/questions";
import { Loader2 } from "lucide-react";
import { UserStats } from "@/components/UserStats";
import { UserProfileCard } from "@/components/UserProfileCard";
import { UserWelcomeCard } from "@/components/UserWelcomeCard";
import { StudyTips } from "@/components/StudyTips";
import { UserActivitySection } from "@/components/UserActivitySection";
import { SupportButton } from "@/components/SupportButton";
import { PricingDialog } from "@/components/PricingDialog";
import { BirthdayDialog } from "@/components/BirthdayDialog";
import LandingPage from "@/components/landing";

// Custom hook to detect mobile screens
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIsMobile();

    // Add event listener
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};

export default function Home() {
  const isMobile = useIsMobile();
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isBirthdayDialogOpen, setIsBirthdayDialogOpen] = useState(false);

  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { isLoading, hasActiveSubscription } = useAuthContext();

  const handleStudyClick = () => {
    window.open(
      "https://www.dmv.ca.gov/portal/file/california-driver-handbook-pdf/",
      "_blank"
    );
  };

  const handlePracticeClick = () => {
    if (!hasActiveSubscription) {
      setIsPricingOpen(true);
      return;
    }
    router.push("/practice");
  };

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
    const checkUserBirthday = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/user/birthday");
        const data = await response.json();

        if (!data.hasBirthday) {
          setIsBirthdayDialogOpen(true);
        }
      } catch (error) {
        console.error("Error checking user birthday:", error);
      }
    };

    checkUserBirthday();
  }, [user]);

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
          <UserProfileCard user={user} />

          {/* Top welcome section */}
          <UserWelcomeCard
            user={user}
            hasActiveSubscription={hasActiveSubscription}
            onStartTestClick={handlePracticeClick}
            onStudyClick={handleStudyClick}
          />

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
        />
        <SupportButton />
      </>
    );
  }

  // If not authenticated, render the landing page
  return <LandingPage />;
}

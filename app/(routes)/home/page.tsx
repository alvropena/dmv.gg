"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuthContext } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { UserHeader } from "@/components/UserHeader";
import { UserStats } from "@/components/UserStats";
import { StudyTips } from "@/components/StudyTips";
import { UserActivitySection } from "@/components/UserActivitySection";
import { SupportButton } from "@/components/SupportButton";
import { PricingDialog } from "@/components/dialogs/PricingDialog";
import { UserProfileDialog } from "@/components/dialogs/UserProfileDialog";
import { UserWelcomeCard } from "@/components/UserWelcomeCard";
import { IncompleteTestDialog } from "@/components/dialogs/IncompleteTestDialog";

export default function HomePage() {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [incompleteTest, setIncompleteTest] = useState<any>(null);
  const [showIncompleteDialog, setShowIncompleteDialog] = useState(false);

  const { isLoaded, user } = useUser();
  const { dbUser, isLoading, refreshUser } = useAuthContext();

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

  // Check if user has profile data set and if dialog was dismissed
  useEffect(() => {
    const dismissedKey = user
      ? `profileDialogDismissed_${user.id}`
      : "profileDialogDismissed";
    const dismissed =
      typeof window !== "undefined" && localStorage.getItem(dismissedKey);

    if (
      !isLoading &&
      dbUser &&
      (!dbUser.birthday ||
        !dbUser.gender ||
        !dbUser.ethnicity ||
        !dbUser.language) &&
      !dismissed
    ) {
      setIsProfileDialogOpen(true);
    }
  }, [dbUser, isLoading, user]);

  // Handle saving profile data
  const handleSaveProfile = async (data: {
    birthday: Date;
    gender: string;
    ethnicity: string;
    language: string;
  }) => {
    try {
      const method = dbUser?.birthday ? "PUT" : "POST";
      const response = await fetch("/api/user/profile", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsProfileDialogOpen(false);
        // Refresh the user data to update the profile
        await refreshUser();
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  // Fetch the user's most recent test
  useEffect(() => {
    async function fetchMostRecentTest() {
      try {
        const res = await fetch("/api/tests");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.tests) && data.tests.length > 0) {
          const mostRecent = data.tests[0];
          if (mostRecent.status === "in_progress") {
            setIncompleteTest(mostRecent);
            setShowIncompleteDialog(true);
          } else {
            setIncompleteTest(null);
            setShowIncompleteDialog(false);
          }
        } else {
          setIncompleteTest(null);
          setShowIncompleteDialog(false);
        }
      } catch (e) {
        setIncompleteTest(null);
        setShowIncompleteDialog(false);
      }
    }
    fetchMostRecentTest();
  }, []);

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F1F1EF]">
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

  return (
    <div className="min-h-screen bg-[#FFFFFF] space-y-4">
      <UserHeader />
      <UserWelcomeCard />
      <UserStats />
      <UserActivitySection />
      <StudyTips />
      {pricingDialog}
      <UserProfileDialog
        isOpen={isProfileDialogOpen}
        onSave={handleSaveProfile}
        onClose={() => setIsProfileDialogOpen(false)}
        initialData={
          dbUser
            ? {
                birthday: dbUser.birthday || undefined,
                gender: dbUser.gender || undefined,
                ethnicity: dbUser.ethnicity || undefined,
                language: dbUser.language || undefined,
              }
            : undefined
        }
        userId={user?.id}
      />
      <IncompleteTestDialog
        isOpen={showIncompleteDialog}
        onClose={() => setShowIncompleteDialog(false)}
        onGoToTest={() => {
          if (incompleteTest) {
            window.location.href = `/test/${incompleteTest.id}`;
          }
        }}
        testInfo={
          incompleteTest ? { startedAt: incompleteTest.startedAt } : undefined
        }
      />
      <SupportButton />
    </div>
  );
}

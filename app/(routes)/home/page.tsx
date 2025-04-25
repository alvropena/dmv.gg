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
import { PricingDialog } from "@/components/PricingDialog";
import { BirthdayDialog } from "@/components/BirthdayDialog";
import { UserWelcomeCard } from "@/components/UserWelcomeCard";

export default function HomePage() {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isBirthdayDialogOpen, setIsBirthdayDialogOpen] = useState(false);

  const { isLoaded } = useUser();
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
        // Refresh the user data to update the birthday
        await refreshUser();
      }
    } catch (error) {
      console.error("Error saving birthday:", error);
    }
  };

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
      <BirthdayDialog
        isOpen={isBirthdayDialogOpen}
        onSave={handleSaveBirthday}
        onClose={() => setIsBirthdayDialogOpen(false)}
      />
      <SupportButton />
    </div>
  );
}

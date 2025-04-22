"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { Gift, LogOut, Sparkles, Zap } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { PricingDialog } from "@/components/PricingDialog";
import { SubscriptionDetailsDialog } from "@/components/SubscriptionDetailsDialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type UserStatsData = {
  studyStreak: number;
};

export function UserHeader() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { dbUser, hasActiveSubscription } = useAuthContext();
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isSubscriptionDetailsOpen, setIsSubscriptionDetailsOpen] =
    useState(false);
  const [stats, setStats] = useState<UserStatsData>({ studyStreak: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [userBirthday, setUserBirthday] = useState<string | null>(null);

  const displayName =
    dbUser?.firstName && dbUser?.lastName
      ? `${dbUser.firstName} ${dbUser.lastName}`
      : dbUser?.firstName || "User";

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
        birthdayDate.getMinutes() + birthdayDate.getTimezoneOffset()
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
      <header className="sticky top-0 w-full z-50 p-4 pt-6 md:pt-12">
        <div className="container mx-auto px-2 md:px-6">
          <div className="flex items-center justify-between bg-white rounded-xl border shadow-sm px-4 md:px-8 py-3 md:py-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user?.imageUrl} alt={displayName} />
                <AvatarFallback>
                  {displayName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm">{displayName}</span>
                {userBirthday && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Gift className="h-3 w-3" />
                    {userBirthday}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!hasActiveSubscription && (
                <Button
                  onClick={() => setIsPricingOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Upgrade
                </Button>
              )}
              <Button
                onClick={() => {
                  signOut();
                }}
                className="flex items-center gap-2"
                variant="secondary"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

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

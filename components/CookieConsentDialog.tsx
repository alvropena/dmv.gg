"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

export function CookieConsentDialog() {
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = document.cookie.includes("cookies_accepted=true");
    if (!cookiesAccepted) {
      // Show dialog after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAllCookies = async () => {
    try {
      // Save cookie acceptance
      await fetch("/api/cookies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "cookies_accepted",
          value: "true",
          options: {
            maxAge: 60 * 60 * 24 * 365, // 1 year
          },
        }),
      });

      // Save analytics preference
      await fetch("/api/cookies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "analytics_enabled",
          value: "true",
          options: {
            maxAge: 60 * 60 * 24 * 365, // 1 year
          },
        }),
      });

      // Save marketing preference
      await fetch("/api/cookies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "marketing_enabled",
          value: "true",
          options: {
            maxAge: 60 * 60 * 24 * 365, // 1 year
          },
        }),
      });

      toast({
        title: "Preferences saved",
        description: "Your cookie preferences have been saved.",
      });

      // Hide dialog
      setIsVisible(false);
    } catch (error) {
      console.error("Error saving cookie preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save cookie preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  const rejectAllCookies = async () => {
    try {
      // Save cookie acceptance but disable analytics and marketing
      await fetch("/api/cookies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "cookies_accepted",
          value: "true",
          options: {
            maxAge: 60 * 60 * 24 * 365, // 1 year
          },
        }),
      });

      // Disable analytics
      await fetch("/api/cookies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "analytics_enabled",
          value: "false",
          options: {
            maxAge: 60 * 60 * 24 * 365, // 1 year
          },
        }),
      });

      // Disable marketing
      await fetch("/api/cookies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "marketing_enabled",
          value: "false",
          options: {
            maxAge: 60 * 60 * 24 * 365, // 1 year
          },
        }),
      });

      setIsVisible(false);
    } catch (error) {
      console.error("Error saving cookie preferences:", error);
    }
  };

  const openManageCookies = () => {
    // For now just navigate to the cookies page
    window.location.href = "/preferences";
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay with high z-index to cover everything including header */}
      <div className="fixed inset-0 bg-black/50 z-[100]" />
      {/* Dialog positioned at the bottom with even higher z-index */}
      <div className="fixed bottom-0 right-0 z-[110] p-4 md:p-6 pointer-events-none w-full flex justify-center md:justify-end">
        <Card className="w-full max-w-md shadow-lg pointer-events-auto relative">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="font-medium">
                Cookies give you a personalised experience
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Want to know about the cookies that help us keep our website safe,
              give you a better experience and show more relevant ads. We
              won&apos;t turn them on unless you accept. Want to know more or
              adjust your preferences?
            </p>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch space-y-2 px-4 pb-4 pt-0">
            <Button className="w-full rounded-full px-6" onClick={acceptAllCookies}>
              Allow all cookies
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full px-6"
              onClick={rejectAllCookies}
            >
              Reject all cookies
            </Button>
            <Button
              variant="ghost"
              className="w-full rounded-full px-6"
              onClick={openManageCookies}
            >
              Manage cookies
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

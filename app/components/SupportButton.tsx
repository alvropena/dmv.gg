"use client";

import { useState } from "react";
import { Headset, Send } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";

export function SupportButton() {
  const { user, isSignedIn } = useUser();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    try {
      setIsSubmitting(true);
      setError("");
      
      // Prepare the request payload
      const payload = {
        message,
        userId: isSignedIn ? user.id : null,
        email: isSignedIn ? user.primaryEmailAddress?.emailAddress : null,
      };

      // Send the request to the API
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit support request");
      }

      setIsSubmitted(true);

      // Reset the form after 3 seconds and close the popover
      setTimeout(() => {
        setMessage("");
        setIsSubmitted(false);
        setOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting support request:", error);
      setError("Failed to send your message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className="h-14 w-14 rounded-full shadow-lg"
            aria-label="Contact Support"
          >
            <Headset className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 mb-4" side="top" align="end">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Contact Support</h3>
                <p className="text-sm text-muted-foreground">
                  Let us know how we can help and our team will get back to you
                  as soon as possible.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  placeholder="Please provide details about your issue or question"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              {error && (
                <div className="text-sm font-medium text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !message}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1">Sending...</span>
                ) : (
                  <span className="flex items-center gap-1">Send</span>
                )}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 gap-2">
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
                <Send className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="font-medium text-lg">Message Sent!</h3>
              <p className="text-sm text-muted-foreground text-center">
                Thank you for contacting us. Our support team will reach out to
                you shortly.
              </p>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

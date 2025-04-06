"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon, Clock, CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { Subscription } from "@/types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface SubscriptionDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionDetailsDialog({
  isOpen,
  onClose,
}: SubscriptionDetailsDialogProps) {
  const { dbUser } = useAuthContext();
  const [activeSubscription, setActiveSubscription] =
    useState<Subscription | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const CONFIRMATION_PHRASE = "cancel";

  useEffect(() => {
    if (dbUser?.subscriptions) {
      const subscription = dbUser.subscriptions.find(
        (sub) =>
          sub.status === "active" && new Date(sub.currentPeriodEnd) > new Date()
      );
      setActiveSubscription(subscription || null);
    }
  }, [dbUser]);

  // Helper function to format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPlanName = (): string => {
    if (!activeSubscription) return "Premium";

    if (!activeSubscription.stripeSubscriptionId) {
      return "Lifetime";
    }

    // Determine if monthly or weekly based on period length
    const start = new Date(activeSubscription.currentPeriodStart);
    const end = new Date(activeSubscription.currentPeriodEnd);
    const diffDays = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 10) return "Weekly";
    if (diffDays <= 35) return "Monthly";
    return "Premium";
  };

  const handleCancelSubscription = async () => {
    if (!activeSubscription?.stripeSubscriptionId) return;

    try {
      setIsCancelling(true);

      // Call our API to cancel the subscription
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: activeSubscription.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel subscription');
      }

      const result = await response.json();
      
      // Update the subscription locally
      setActiveSubscription(prev => 
        prev ? { ...prev, cancelAtPeriodEnd: true } : null
      );
      
      // Reset confirmation UI
      setShowCancelConfirmation(false);
      setConfirmationText("");

      // Show toast notification
      toast.success("We are sad to see you go :(", {
        description: "Your subscription will remain active until the end of the billing period.",
      });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error(error instanceof Error ? error.message : "Failed to cancel subscription");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelRequest = () => {
    setShowCancelConfirmation(true);
  };

  const handleCancelBack = () => {
    setShowCancelConfirmation(false);
    setConfirmationText("");
  };

  const handleReactivateSubscription = async () => {
    if (!activeSubscription?.stripeSubscriptionId) return;

    try {
      setIsReactivating(true);

      // Call our API to reactivate the subscription
      const response = await fetch('/api/subscriptions/reactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: activeSubscription.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reactivate subscription');
      }

      const result = await response.json();
      
      // Update the subscription locally
      setActiveSubscription(prev => 
        prev ? { ...prev, cancelAtPeriodEnd: false } : null
      );

      // Show toast notification
      toast.success("Welcome back! :)", {
        description: "Your subscription has been reactivated successfully.",
      });
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      toast.error(error instanceof Error ? error.message : "Failed to reactivate subscription");
    } finally {
      setIsReactivating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-[90%] mx-auto rounded-md">
        {!showCancelConfirmation ? (
          <>
            <DialogHeader>
              <DialogTitle>Manage Subscription</DialogTitle>
              <DialogDescription>
                Details about your premium subscription.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-muted-foreground font-medium">
                      Plan
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {getPlanName()}
                    </TableCell>
                  </TableRow>

                  {activeSubscription && (
                    <>
                      <TableRow>
                        <TableCell className="text-muted-foreground font-medium">
                          Status
                        </TableCell>
                        <TableCell className="text-right">
                          {activeSubscription.cancelAtPeriodEnd ? (
                            <Badge variant="destructive" className="rounded-full">
                              <XCircle className="h-3 w-3 mr-1" />
                              Canceled
                            </Badge>
                          ) : (
                            <Badge variant="success" className="rounded-full">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>

                      {activeSubscription.stripeSubscriptionId && (
                        <TableRow>
                          <TableCell className="text-muted-foreground font-medium">
                            {activeSubscription.cancelAtPeriodEnd ? "Active until" : "Next renewal"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              <span className="font-medium">
                                {formatDate(
                                  new Date(activeSubscription.currentPeriodEnd)
                                )}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}

                      {!activeSubscription.stripeSubscriptionId && (
                        <TableRow>
                          <TableCell className="text-muted-foreground font-medium">
                            Expires
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">Never (Lifetime)</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
              {activeSubscription?.stripeSubscriptionId && !activeSubscription.cancelAtPeriodEnd && (
                <Button 
                  onClick={handleCancelRequest}
                  variant="destructive"
                  className="order-1 sm:order-2"
                >
                  Cancel Subscription
                </Button>
              )}
              
              {activeSubscription?.stripeSubscriptionId && activeSubscription.cancelAtPeriodEnd && (
                <Button 
                  onClick={handleReactivateSubscription}
                  variant="default"
                  disabled={isReactivating}
                  className="order-1 sm:order-2"
                >
                  {isReactivating ? 
                    <Loader2 className="h-4 w-4 animate-spin" /> : 
                    "Reactivate Subscription"
                  }
                </Button>
              )}
              
              <Button onClick={onClose} variant="outline" className="order-2 sm:order-1">
                Close
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Cancel Subscription</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your subscription?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-md border border-amber-200 flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800">
                  <p>Your subscription will remain active until the end of your current billing period. After that, you will lose access to premium features.</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Type <span className="font-bold">{CONFIRMATION_PHRASE}</span> to confirm cancellation:
                </p>
                <Input 
                  value={confirmationText} 
                  onChange={(e) => setConfirmationText(e.target.value)} 
                  placeholder={CONFIRMATION_PHRASE}
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
              <Button 
                onClick={handleCancelSubscription} 
                variant="destructive"
                disabled={isCancelling || confirmationText.toLowerCase() !== CONFIRMATION_PHRASE}
                className="order-1 sm:order-2"
              >
                {isCancelling ? 
                  <Loader2 className="h-4 w-4 animate-spin" /> : 
                  "Confirm Cancellation"
                }
              </Button>
              
              <Button 
                onClick={handleCancelBack} 
                variant="outline" 
                className="order-2 sm:order-1 sm:ml-0"
                disabled={isCancelling}
              >
                Back
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

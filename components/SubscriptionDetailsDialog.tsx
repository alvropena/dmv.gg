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
import { CalendarIcon, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Subscription } from "@/types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

      // This would be the API call to cancel the subscription
      // For now, just close the dialog after a delay to simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close the dialog after "cancelling"
      onClose();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
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
                      <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-md text-green-500">
                        <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                        Active
                      </div>
                    </TableCell>
                  </TableRow>

                  {activeSubscription.stripeSubscriptionId && (
                    <TableRow>
                      <TableCell className="text-muted-foreground font-medium">
                        Next renewal
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
          <Button onClick={onClose} variant="outline">
            Close
          </Button>

          {activeSubscription?.stripeSubscriptionId && (
            <Button 
              onClick={handleCancelSubscription} 
              variant="destructive"
              disabled={isCancelling}
            >
              {isCancelling && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Cancel Subscription
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

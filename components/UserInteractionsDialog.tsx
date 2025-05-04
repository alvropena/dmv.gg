import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface UserInteractionsDialogProps {
  open: boolean;
  user: User | null;
  onOpenChange: (open: boolean) => void;
}

export function UserInteractionsDialog({
  open,
  user,
  onOpenChange,
}: UserInteractionsDialogProps) {
  // Mock data for demonstration
  const [studyReminders, setStudyReminders] = useState(true);
  const welcomeEmailSent = true; // Replace with real data
  const welcomeEmailSentAt = new Date("2024-06-01T10:00:00Z"); // Replace with real data
  const lastStudyReminderSentAt = new Date("2024-06-10T15:30:00Z"); // Replace with real data

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Interactions</DialogTitle>
          <DialogDescription>
            Communication and engagement options for {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          {/* Welcome Email */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">Welcome Email</span>
              <Badge
                variant="outline"
                className={
                  welcomeEmailSent
                    ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30 w-16 flex items-center justify-center"
                    : "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 w-16 flex items-center justify-center"
                }
              >
                {welcomeEmailSent ? "Sent" : "Not Sent"}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {welcomeEmailSent
                ? `Sent at ${welcomeEmailSentAt.toLocaleString()}`
                : "No welcome email has been sent to this user."}
            </div>
          </div>

          {/* Study Reminders */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">Study Reminders</span>
              <Switch
                checked={studyReminders}
                onCheckedChange={setStudyReminders}
                id="study-reminders-switch"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {studyReminders
                ? "User is currently receiving study reminders."
                : "User is not receiving study reminders."}
            </div>
            {studyReminders && (
              <div className="text-xs text-muted-foreground">
                Last reminder sent at {lastStudyReminderSentAt.toLocaleString()}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, FileText } from "lucide-react";
import { UserResource } from "@clerk/types";

type UserWelcomeCardProps = {
  user: UserResource;
  progress?: number;
  hasActiveSubscription: boolean;
  onPracticeClick: () => void;
  onStudyClick: () => void;
};

export function UserWelcomeCard({
  user,
  progress = 42,
  hasActiveSubscription,
  onPracticeClick,
  onStudyClick,
}: UserWelcomeCardProps) {
  const displayName = user.firstName || user.fullName?.split(" ")[0] || "User";
  
  return (
    <div className="rounded-lg p-6 mb-6 border border-slate-200 dark:border-slate-800">
      <h2 className="text-2xl font-bold mb-1">
        Welcome back, {displayName}!
      </h2>
      <p className="text-muted-foreground mb-4">
        Ready to continue your DMV test preparation? You&apos;re making
        great progress!
      </p>

      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="font-medium">Overall progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <Button
          onClick={onPracticeClick}
          className="flex items-center gap-2"
        >
          {!hasActiveSubscription ? (
            <Lock className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          Practice Test
        </Button>
        <Button
          onClick={onStudyClick}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          DMV Handbook
        </Button>
      </div>
    </div>
  );
} 
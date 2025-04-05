import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
    <div className="rounded-lg p-4 mb-6 border border-slate-200 dark:border-slate-800">
      <div className="px-1">
        <h2 className="text-2xl font-bold mb-1">
          Welcome back, {displayName}!
        </h2>
        <p className="text-muted-foreground mb-5 text-sm">
          Ready to continue your DMV test preparation? You&apos;re making
          great progress!
        </p>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium text-sm">Overall progress</span>
            <span className="font-medium text-sm">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2.5" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onPracticeClick}
            className="flex items-center justify-center gap-2"
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
            className="flex items-center justify-center gap-2"
          >
            <FileText className="h-4 w-4" />
            DMV Handbook
          </Button>
        </div>
      </div>
    </div>
  );
} 
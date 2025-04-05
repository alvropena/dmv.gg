import { User } from "lucide-react";
import { UserResource } from "@clerk/types";

type UserProfileCardProps = {
  user: UserResource;
  studyStreak?: number;
  studyTime?: string;
};

export function UserProfileCard({ 
  user, 
  studyStreak = 3, 
  studyTime = "4h 23m" 
}: UserProfileCardProps) {
  const displayName = user.firstName || user.fullName?.split(" ")[0] || "User";
  
  return (
    <div className="rounded-lg p-4 mb-6 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-slate-500" />
          </div>
          <div>
            <h3 className="font-medium">{displayName}</h3>
            <p className="text-sm text-muted-foreground">
              Premium Member
            </p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Study streak</p>
            <p className="font-semibold">{studyStreak} days</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Time studied</p>
            <p className="font-semibold">{studyTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
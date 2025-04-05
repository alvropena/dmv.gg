import { RecentSessions } from "./RecentSessions";
import { UserAnalytics } from "./UserAnalytics";

type UserActivitySectionProps = {
  isLoading?: boolean;
};

export function UserActivitySection({ isLoading = false }: UserActivitySectionProps) {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentSessions isLoading={isLoading} />
        <UserAnalytics />
      </div>
    </div>
  );
} 
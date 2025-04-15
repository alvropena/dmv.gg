import { RecentSessions } from "./RecentSessions";
import { WeakAreas } from "./WeakAreas";

type UserActivitySectionProps = {
  isLoading?: boolean;
};

export function UserActivitySection({ isLoading = false }: UserActivitySectionProps) {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentSessions isLoading={isLoading} />
        <WeakAreas isLoading={isLoading} />
      </div>
    </div>
  );
} 
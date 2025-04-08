import { RecentSessions } from "./RecentSessions";

type UserActivitySectionProps = {
  isLoading?: boolean;
};

export function UserActivitySection({ isLoading = false }: UserActivitySectionProps) {
  return (
    <div className="mb-6">
      <div className="w-full">
        <RecentSessions isLoading={isLoading} />
      </div>
    </div>
  );
} 
import { Star, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserPlanCellProps {
  subscriptions?: Array<{ status: string }>;
}

export function UserPlanCell({ subscriptions = [] }: UserPlanCellProps) {
  return (
    <td className="px-4 py-3 text-center">
      {subscriptions.some((sub) => sub.status === "active") ? (
        <Badge
          variant="default"
          className="bg-yellow-200 text-yellow-600 border-yellow-400"
        >
          <Star className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      ) : (
        <Badge
          variant="secondary"
          className="bg-gray-200 text-gray-700 border-gray-300"
        >
          <UserIcon className="w-3 h-3 mr-1" />
          Free
        </Badge>
      )}
    </td>
  );
} 
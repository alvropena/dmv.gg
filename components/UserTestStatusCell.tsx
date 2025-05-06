import { Badge } from "@/components/ui/badge";

interface UserTestStatusCellProps {
  hasUsedFreeTest: boolean;
}

export function UserTestStatusCell({ hasUsedFreeTest }: UserTestStatusCellProps) {
  return (
    <td className="px-4 py-3 text-center">
      <Badge
        variant="outline"
        className={
          hasUsedFreeTest
            ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30"
            : "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30"
        }
      >
        {hasUsedFreeTest ? "True" : "False"}
      </Badge>
    </td>
  );
} 
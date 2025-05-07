import { Badge } from "@/components/ui/badge";
import type { Test } from "@/types";

interface UserTestStatsCellProps {
  tests?: Test[];
  type: "completed" | "initiated" | "average";
}

export function UserTestStatsCell({ tests = [], type }: UserTestStatsCellProps) {
  if (type === "completed") {
    const completedTests = tests.filter((test) => test.status === "completed");
    return <td className="px-4 py-3 text-center">{completedTests.length}</td>;
  }

  if (type === "initiated") {
    const initiatedTests = tests.filter((test) => test.status !== "completed");
    return <td className="px-4 py-3 text-center">{initiatedTests.length}</td>;
  }

  // Average score calculation
  const completedTests = tests.filter((test) => test.status === "completed");
  if (completedTests.length === 0) return <td className="px-4 py-3 text-center">-</td>;

  const totalCorrectAnswers = completedTests.reduce(
    (sum, test) => sum + (test.answers?.filter((a) => a.isCorrect === true).length || 0),
    0
  );
  const totalQuestions = completedTests.reduce(
    (sum, test) => sum + test.totalQuestions,
    0
  );
  const avgScore =
    totalQuestions > 0
      ? Math.round((totalCorrectAnswers / totalQuestions) * 100)
      : 0;
  const isPassing = avgScore >= 89.13;

  return (
    <td className="px-4 py-3 text-center">
      <Badge
        variant="outline"
        className={`${
          isPassing
            ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30"
            : "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30"
        } w-16 flex items-center justify-center`}
      >
        {avgScore}%
      </Badge>
    </td>
  );
} 
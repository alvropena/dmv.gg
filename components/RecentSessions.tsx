import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Test, TestAnswer } from "@prisma/client";
import { useRouter } from "next/navigation";

type TestWithAnswers = Test & {
  answers: TestAnswer[];
};

type RecentSessionsProps = {
  isLoading?: boolean;
};

export function RecentSessions({
  isLoading: initialLoading = false,
}: RecentSessionsProps) {
  const router = useRouter();
  const [tests, setTests] = useState<TestWithAnswers[]>([]);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/tests");

        if (!response.ok) {
          throw new Error("Failed to fetch tests");
        }

        const data = await response.json();
        setTests(data.tests || []);
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError("Failed to load tests. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: Date | null) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to format duration
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0 minutes";

    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  };

  // Calculate progress for in-progress tests
  const getAnsweredCount = (test: TestWithAnswers) => {
    return test.answers.filter(a => a.selectedAnswer !== null).length;
  };

  // Get the latest 2 tests for display
  const recentTests = tests.slice(0, 2);

  // Navigate to test page
  const handleTestNavigation = (testId: string, isCompleted: boolean) => {
    if (isCompleted) {
      // Navigate to review page
      router.push(`/practice?test=${testId}&review=true`);
    } else {
      // Continue the test
      router.push(`/practice?test=${testId}`);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Sessions</h2>
        <Link
          href="/tests"
          className="text-primary flex items-center gap-1 text-sm font-medium"
        ></Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 border border-red-200 rounded-lg">
          {error}
        </div>
      ) : (
        <div>
          {recentTests.length === 0 ? (
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-6 text-center text-muted-foreground">
              No tests found. Start a practice test to see your tests
              here.
            </div>
          ) : (
            recentTests.map((test) => (
              <div
                key={test.id}
                className="border border-slate-200 dark:border-slate-800 rounded-lg p-6 mb-4 last:mb-0"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {test.status === "completed" && (
                      <Badge variant="success">
                        Completed
                      </Badge>
                    )}
                    <h3 className="font-semibold text-lg">
                      {test.status === "completed"
                        ? "Traffic Laws Test"
                        : "Road Signs Practice Test"}
                    </h3>
                  </div>
                  <Button
                    variant={
                      test.status === "completed" ? "outline" : "default"
                    }
                    onClick={() => handleTestNavigation(test.id, test.status === "completed")}
                  >
                    {test.status === "completed" ? "Review" : "Continue"}
                  </Button>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    {test.status !== "completed" && (
                      <Badge className="text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
                        In Progress
                      </Badge>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        {formatDate(test.startedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  {test.status === "completed" ? (
                    <>
                      <span className="text-sm">
                        Score: {test.score}% (
                        {Math.round(
                          (test.score / 100) * test.totalQuestions
                        )}
                        /{test.totalQuestions} correct)
                      </span>
                      <Badge
                        variant={
                          test.score >= 70 ? "success" : "destructive"
                        }
                      >
                        {test.score >= 70 ? "Passing" : "Failed"}
                      </Badge>
                    </>
                  ) : (
                    <>
                      <span className="text-sm">
                        Progress: <span className="font-bold">{getAnsweredCount(test)} completed, {test.totalQuestions - getAnsweredCount(test)} left</span>
                      </span>
                      <span className="text-sm font-bold">
                        {Math.round((getAnsweredCount(test) / test.totalQuestions) * 100)}%
                      </span>
                    </>
                  )}
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width:
                        test.status === "completed"
                          ? `${test.score}%`
                          : `${Math.round(
                              (getAnsweredCount(test) / test.totalQuestions) * 100
                            )}%`,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

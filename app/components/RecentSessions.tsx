import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

type SessionAnswer = {
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
};

type Session = {
  id: string;
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number | null;
  score: number;
  totalQuestions: number;
  status: string;
  answers: SessionAnswer[];
};

type RecentSessionsProps = {
  isLoading?: boolean;
};

export function RecentSessions({
  isLoading: initialLoading = false,
}: RecentSessionsProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/study-sessions");

        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }

        const data = await response.json();
        setSessions(data.sessions || []);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Failed to load sessions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string) => {
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

  // Get the latest 2 sessions for display
  const recentSessions = sessions.slice(0, 2);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Sessions</h2>
        <Link
          href="/sessions"
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
          {recentSessions.length === 0 ? (
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-6 text-center text-muted-foreground">
              No sessions found. Start a practice test to see your sessions
              here.
            </div>
          ) : (
            recentSessions.map((session) => (
              <div
                key={session.id}
                className="border border-slate-200 dark:border-slate-800 rounded-lg p-6 mb-4 last:mb-0"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        session.status === "completed" ? "success" : "secondary"
                      }
                      className={
                        session.status !== "completed"
                          ? "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
                          : ""
                      }
                    >
                      {session.status === "completed"
                        ? "Completed"
                        : "In Progress"}
                    </Badge>
                    <h3 className="font-semibold text-lg">
                      {session.status === "completed"
                        ? "Traffic Laws Test"
                        : "Road Signs Practice Test"}
                    </h3>
                  </div>
                  <Button
                    variant={
                      session.status === "completed" ? "outline" : "default"
                    }
                  >
                    {session.status === "completed" ? "Review" : "Continue"}
                  </Button>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {formatDate(session.startedAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      Time spent: {formatDuration(session.durationSeconds)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  {session.status === "completed" ? (
                    <>
                      <span className="text-sm">
                        Score: {session.score}% (
                        {Math.round(
                          (session.score / 100) * session.totalQuestions
                        )}
                        /{session.totalQuestions} correct)
                      </span>
                      <Badge
                        variant={
                          session.score >= 70 ? "success" : "destructive"
                        }
                      >
                        {session.score >= 70 ? "Passing" : "Failed"}
                      </Badge>
                    </>
                  ) : (
                    <>
                      <span className="text-sm">
                        Progress:{" "}
                        {Math.round(
                          (session.answers.filter(
                            (a) => a.selectedAnswer !== null
                          ).length /
                            session.totalQuestions) *
                            100
                        )}
                        % (
                        {
                          session.answers.filter(
                            (a) => a.selectedAnswer !== null
                          ).length
                        }{" "}
                        completed,{" "}
                        {session.totalQuestions -
                          session.answers.filter(
                            (a) => a.selectedAnswer !== null
                          ).length}{" "}
                        left)
                      </span>
                      <span className="text-sm font-medium">
                        {session.answers.filter(
                          (a) => a.selectedAnswer !== null
                        ).length === 0
                          ? "Ready to start"
                          : "In progress"}
                      </span>
                    </>
                  )}
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width:
                        session.status === "completed"
                          ? `${session.score}%`
                          : `${Math.round(
                              (session.answers.filter(
                                (a) => a.selectedAnswer !== null
                              ).length /
                                session.totalQuestions) *
                                100
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

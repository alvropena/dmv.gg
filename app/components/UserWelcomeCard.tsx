import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lock, ArrowRight, FileText } from "lucide-react";
import { UserResource } from "@clerk/types";
import { useState, useEffect } from "react";

type UserWelcomeCardProps = {
  user: UserResource;
  hasActiveSubscription: boolean;
  onPracticeClick: () => void;
  onStudyClick: () => void;
};

type Test = {
  id: string;
  totalQuestions: number;
  completedQuestions: number;
  correctAnswers: number;
  status: string;
  answers: Array<{
    id: string;
    isCorrect: boolean | null;
  }>;
};

export function UserWelcomeCard({
  user,
  hasActiveSubscription,
  onPracticeClick,
  onStudyClick,
}: UserWelcomeCardProps) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const displayName = user.firstName || user.fullName?.split(" ")[0] || "User";
  
  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/tests');
        
        if (!response.ok) {
          throw new Error('Failed to fetch tests');
        }
        
        const data = await response.json();
        
        // Get the most recent test
        if (data.tests && data.tests.length > 0) {
          const latestTest = data.tests[0] as Test;
          
          // Calculate progress based on answered questions
          if (latestTest.totalQuestions > 0) {
            // Count how many questions have been answered (where isCorrect is not null)
            const answeredCount = latestTest.answers.filter(answer => answer.isCorrect !== null).length;
            const correctCount = latestTest.answers.filter(answer => answer.isCorrect === true).length;
            
            // If test is completed, show percentage of correct answers
            if (latestTest.status === 'completed') {
              const progressPercentage = Math.round((correctCount / latestTest.totalQuestions) * 100);
              setProgress(progressPercentage);
            } 
            // If test is in progress, show percentage of answered questions
            else {
              const progressPercentage = Math.round((answeredCount / latestTest.totalQuestions) * 100);
              setProgress(progressPercentage);
            }
          } else {
            setProgress(0);
          }
        } else {
          // No tests found
          setProgress(0);
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
        setProgress(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProgress();
  }, []);
  
  return (
    <div className="rounded-lg p-4 mb-6 border border-slate-200 dark:border-slate-800">
      <div className="px-1">
        <h2 className="text-2xl font-bold mb-1">
          Welcome back, {displayName}!
        </h2>
        <p className="text-muted-foreground mb-5 text-sm">
          Ready to continue your DMV test preparation? You&apos;re making
          {progress > 0 ? " great" : ""} progress!
        </p>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium text-sm">Overall progress</span>
            <span className="font-medium text-sm">{isLoading ? "Loading..." : `${progress}%`}</span>
          </div>
          <Progress value={isLoading ? 5 : progress} className={`h-2.5 ${isLoading ? "animate-pulse" : ""}`} />
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
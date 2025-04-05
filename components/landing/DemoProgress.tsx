'use client';

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface DemoProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  progressPercentage: number;
}

export function DemoProgress({
  currentQuestionIndex,
  totalQuestions,
  score,
  streak,
  progressPercentage,
}: DemoProgressProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Badge variant="outline" className="text-sm">
          Question {currentQuestionIndex + 1}/{totalQuestions}
        </Badge>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Score: {score}
          </Badge>
          {streak >= 3 && (
            <Badge className="bg-orange-500">🔥 Streak: {streak}</Badge>
          )}
        </div>
      </div>
      <Progress value={progressPercentage} className="mb-6" />
    </>
  );
} 
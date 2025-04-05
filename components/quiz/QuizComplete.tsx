'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, RotateCcw } from "lucide-react";

interface QuizCompleteProps {
  score: number;
  totalQuestions: number;
  progressPercentage: number;
  onReset: () => void;
}

export function QuizComplete({
  score,
  totalQuestions,
  progressPercentage,
  onReset,
}: QuizCompleteProps) {
  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6 flex flex-col items-center">
            <Trophy className="h-16 w-16 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
            <p className="text-xl mb-6">
              Your score: {score} / {totalQuestions}
            </p>
            <Progress value={progressPercentage} className="w-full mb-6" />
            <p className="mb-6">
              {score === totalQuestions
                ? "Perfect score! You're ready for the DMV test!"
                : "Keep practicing to improve your score!"}
            </p>
            <Button onClick={onReset} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
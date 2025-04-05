'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, RotateCcw, ArrowRight } from "lucide-react";
import { useState } from "react";
import { SignInDialog } from "@/components/SignInDialog";

interface DemoCompleteProps {
  score: number;
  totalQuestions: number;
  progressPercentage: number;
  onReset: () => void;
}

export function DemoComplete({
  score,
  totalQuestions,
  progressPercentage,
  onReset,
}: DemoCompleteProps) {
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6 flex flex-col items-center">
            <Trophy className="h-16 w-16 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Demo Complete!</h2>
            <p className="text-xl mb-6">
              Your demo score: {score} / {totalQuestions}
            </p>
            <Progress value={progressPercentage} className="w-full mb-6" />
            <p className="mb-6">
              {score === totalQuestions
                ? "Perfect score! Ready to start your real practice?"
                : "This was just a demo - sign up to access full practice tests!"}
            </p>
            <div className="flex gap-4">
              <Button 
                variant="secondary" 
                onClick={onReset} 
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Try Demo Again
              </Button>
              <Button 
                onClick={() => setIsSignInOpen(true)}
                className="flex items-center gap-2"
              >
                Sign Up
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <SignInDialog
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </div>
  );
} 
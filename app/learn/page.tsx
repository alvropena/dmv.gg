"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trophy, RotateCcw, BookOpen, ArrowLeft } from "lucide-react";
import { questions } from "../data/questions";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// Custom hook to detect mobile screens
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIsMobile();

    // Add event listener
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};

export default function LearnPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const [questionsReviewed, setQuestionsReviewed] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Space to toggle explanation
      if (e.key === " ") {
        e.preventDefault();
        if (!isExplanationVisible) {
          setIsExplanationVisible(true);
        } else {
          goToNextQuestion();
        }
      }
    },
    [isExplanationVisible]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const showExplanation = () => {
    setIsExplanationVisible(true);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsExplanationVisible(false);
      setQuestionsReviewed((prev) => prev + 1);
    } else {
      // Last question reviewed
      setQuestionsReviewed(questions.length);
      router.push('/dashboard');
    }
  };

  const progressPercentage = (questionsReviewed / questions.length) * 100;

  // Add explanations to questions (these would normally be part of your data)
  const explanations = [
    "When approaching a yield sign, you must slow down and be prepared to stop if necessary. You are required to yield the right-of-way to vehicles already in the intersection or approaching on another road.",
    "The legal blood alcohol concentration (BAC) limit for most drivers is 0.08%. For commercial drivers, it's 0.04%, and for drivers under 21, there's usually a zero-tolerance policy.",
    "Hydroplaning occurs when your tires lose contact with the road surface due to water. To prevent it, maintain proper tire pressure, slow down on wet roads, and avoid sudden turns or braking.",
    "When emergency vehicles with flashing lights approach, you should pull over to the right edge of the road and stop until they pass. This allows them clear passage through traffic.",
    "A solid yellow line indicates no passing. A broken yellow line means passing is permitted when safe. Double yellow lines mean no passing for traffic traveling in either direction.",
  ];

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Learn the DMV Rules
          </h1>
          <h2 className="text-xl text-muted-foreground max-w-xl mx-auto px-4">
            Review concepts and understand the reasoning behind each answer
          </h2>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline" className="text-sm">
            Topic {currentQuestionIndex + 1}/{questions.length}
          </Badge>
        </div>

        <Progress value={progressPercentage} className="mb-6" />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Question</CardTitle>
            <CardDescription>Review and understand the key concept</CardDescription>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">
              {currentQuestion.question}
            </h2>

            {currentQuestion.type === "image" && (
              <div className="flex justify-center mb-4">
                <img
                  src={currentQuestion.imageUrl || "/placeholder.svg"}
                  alt="Question visual"
                  className="max-h-48 object-contain border rounded"
                />
              </div>
            )}

            <div className="space-y-3 mt-4">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg flex items-center ${
                    index === currentQuestion.correctAnswer
                      ? "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-500"
                      : "bg-muted/50"
                  }`}
                >
                  <div className="flex-1">
                    <span className="font-medium mr-2">{index + 1}.</span>
                    {option}
                  </div>
                  {index === currentQuestion.correctAnswer && (
                    <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                  )}
                </div>
              ))}
            </div>

            {isExplanationVisible && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-lg mb-2">Explanation:</h3>
                <p>{explanations[currentQuestionIndex % explanations.length]}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          {!isExplanationVisible ? (
            <Button
              onClick={showExplanation}
              className="w-full flex items-center justify-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Show Explanation{!isMobile && " (Space)"}
            </Button>
          ) : (
            <Button onClick={goToNextQuestion} className="w-full">
              Next Question{!isMobile && " (Space)"}
            </Button>
          )}
        </div>

        {!isMobile && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Keyboard shortcuts: Space to show explanation/continue
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

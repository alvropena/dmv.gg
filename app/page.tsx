"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { questions } from "./data/questions";

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
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

export default function Home() {
  const isMobile = useIsMobile();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Number keys 1-4 for selecting options (0-3 in array)
      if (e.key >= "1" && e.key <= "4" && !isAnswerRevealed) {
        const optionIndex = Number.parseInt(e.key) - 1;
        if (optionIndex >= 0 && optionIndex < currentQuestion.options.length) {
          setSelectedOption(optionIndex);
        }
      }

      // Space to check answer or continue
      if (e.key === " ") {
        e.preventDefault();
        if (!isAnswerRevealed && selectedOption !== null) {
          setIsAnswerRevealed(true);
          setQuestionsAnswered((prev) => prev + 1);

          if (selectedOption === currentQuestion.correctAnswer) {
            setScore((prev) => prev + 1);
            setStreak((prev) => prev + 1);
          } else {
            setStreak(0);
          }
        } else if (isAnswerRevealed) {
          goToNextQuestion();
        }
      }
    },
    [currentQuestion, selectedOption, isAnswerRevealed]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const selectOption = (index: number) => {
    if (!isAnswerRevealed) {
      setSelectedOption(index);
    }
  };

  const checkAnswer = () => {
    if (selectedOption !== null && !isAnswerRevealed) {
      setIsAnswerRevealed(true);
      setQuestionsAnswered((prev) => prev + 1);

      if (selectedOption === currentQuestion.correctAnswer) {
        setScore((prev) => prev + 1);
        setStreak((prev) => prev + 1);
      } else {
        setStreak(0);
      }
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      setIsComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setQuestionsAnswered(0);
    setStreak(0);
    setIsComplete(false);
  };

  const progressPercentage = (questionsAnswered / questions.length) * 100;

  if (isComplete) {
    return (
      <div className="w-full h-fit px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold bg-blue-600 text-white px-4 py-2 rounded">DMV</h1>
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-lg font-semibold">AP</AvatarFallback>
            </Avatar>
          </div>
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-6 flex flex-col items-center">
              <Trophy className="h-16 w-16 text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
              <p className="text-xl mb-6">
                Your score: {score} / {questions.length}
              </p>
              <Progress value={progressPercentage} className="w-full mb-6" />
              <p className="mb-6">
                {score === questions.length
                  ? "Perfect score! You're ready for the DMV test!"
                  : "Keep practicing to improve your score!"}
              </p>
              <Button onClick={resetQuiz} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-fit px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold bg-blue-600 text-white px-4 py-2 rounded">DMV</h1>
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-lg font-semibold">AP</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Question {currentQuestionIndex + 1}/{questions.length}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Score: {score}
            </Badge>
          </div>
          {streak >= 3 && (
            <Badge className="bg-orange-500">🔥 Streak: {streak}</Badge>
          )}
        </div>

        <Progress value={progressPercentage} className="mb-6" />

        <Card className="mb-6">
          <CardContent className="p-6">
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
                  className={`p-3 border rounded-lg cursor-pointer transition-colors flex items-center ${
                    selectedOption === index
                      ? "border-primary bg-primary/10"
                      : "hover:bg-muted"
                  } ${
                    isAnswerRevealed && index === currentQuestion.correctAnswer
                      ? "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-500"
                      : ""
                  } ${
                    isAnswerRevealed &&
                    selectedOption === index &&
                    index !== currentQuestion.correctAnswer
                      ? "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-500"
                      : ""
                  }`}
                  onClick={() => selectOption(index)}
                >
                  <div className="flex-1">
                    <span className="font-medium mr-2">{index + 1}.</span>
                    {option}
                  </div>
                  {isAnswerRevealed &&
                    index === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                    )}
                  {isAnswerRevealed &&
                    selectedOption === index &&
                    index !== currentQuestion.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-500 ml-2" />
                    )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          {!isAnswerRevealed ? (
            <Button
              onClick={checkAnswer}
              disabled={selectedOption === null}
              className="w-full"
            >
              Check Answer{!isMobile && " (Space)"}
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
              Keyboard shortcuts: Press 1-4 to select an option, Space to
              check/continue
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

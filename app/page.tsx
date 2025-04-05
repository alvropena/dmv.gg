"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { questions } from "./data/questions";
import { DemoQuestion } from "@/components/landing/DemoQuestion";
import { DemoProgress } from "@/components/landing/DemoProgress";
import { DemoComplete } from "@/components/landing/DemoComplete";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { PricingDialog } from "@/components/PricingDialog";

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

export default function Home() {
  const isMobile = useIsMobile();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [demoScore, setDemoScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isDemoComplete, setIsDemoComplete] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { dbUser, isLoading, hasActiveSubscription } = useAuthContext();

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
          checkAnswer();
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
        setDemoScore((prev) => prev + 1);
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
      setIsDemoComplete(true);
    }
  };

  const resetDemo = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setDemoScore(0);
    setQuestionsAnswered(0);
    setStreak(0);
    setIsDemoComplete(false);
  };

  const handleStudyClick = () => {
    window.open(
      "https://www.dmv.ca.gov/portal/file/california-driver-handbook-pdf/",
      "_blank"
    );
  };

  const handlePracticeClick = () => {
    console.log(
      "Practice Test clicked. Subscription status:",
      hasActiveSubscription
    );
    if (!hasActiveSubscription) {
      console.log("Opening pricing dialog...");
      setIsPricingOpen(true);
      return;
    }
    router.push("/practice");
  };

  // Add handlePlanSelect function
  const handlePlanSelect = async (plan: "weekly" | "monthly" | "lifetime") => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  if (!isLoaded || isLoading) {
    return <div>Loading...</div>;
  }

  const progressPercentage = (questionsAnswered / questions.length) * 100;

  // Add PricingDialog component that will be used across all views
  const pricingDialog = (
    <PricingDialog
      isOpen={isPricingOpen}
      onClose={() => setIsPricingOpen(false)}
      onPlanSelect={(plan) => {
        handlePlanSelect(plan);
        setIsPricingOpen(false);
      }}
    />
  );

  // Render dashboard if user is authenticated
  if (user) {
    return (
      <>
        <UserDashboard
          user={user}
          hasActiveSubscription={hasActiveSubscription}
          onStartQuiz={handlePracticeClick}
          onLearnClick={handleStudyClick}
          isComplete={isDemoComplete}
          score={demoScore}
          totalQuestions={questions.length}
          progressPercentage={progressPercentage}
          onReset={resetDemo}
        />
        {pricingDialog}
      </>
    );
  }

  // If not authenticated, render the landing page demo
  if (isDemoComplete) {
    return (
      <>
        <DemoComplete
          score={demoScore}
          totalQuestions={questions.length}
          progressPercentage={progressPercentage}
          onReset={resetDemo}
        />
        {pricingDialog}
      </>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Ace Your DMV Knowledge Test
          </h1>
          <h2 className="text-xl md:text-3xl text-muted-foreground max-w-xl mx-auto px-4">
            Practice with real questions, track your progress, and ace your test
            💯
          </h2>
        </div>

        <DemoProgress
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          score={demoScore}
          streak={streak}
          progressPercentage={progressPercentage}
        />

        <DemoQuestion
          question={currentQuestion.question}
          options={currentQuestion.options}
          selectedOption={selectedOption}
          isAnswerRevealed={isAnswerRevealed}
          correctAnswer={currentQuestion.correctAnswer}
          onOptionSelect={selectOption}
        />

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
      {pricingDialog}
    </div>
  );
}

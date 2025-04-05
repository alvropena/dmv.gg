"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAuthContext } from '@/contexts/AuthContext';
import { Question } from "@/types";

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

export default function PracticeTestPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { hasActiveSubscription, isLoading } = useAuthContext();
  const isMobile = useIsMobile();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(true);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [elapsedTime, setElapsedTime] = useState<string>("00:00");

  // Timer effect to update elapsed time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diffMs = now.getTime() - startTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      setElapsedTime(
        `${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Create a new study session
  useEffect(() => {
    const createStudySession = async () => {
      try {
        if (!hasActiveSubscription || !user) return;
        
        // Don't create a session if we already have one
        if (sessionId) return;
        
        // Check if there's already a session ID in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const urlSessionId = urlParams.get('session');
        
        // If URL already has a session ID, use that instead of creating a new one
        if (urlSessionId) {
          setSessionId(urlSessionId);
          setIsCreatingSession(false);
          return;
        }
        
        // Only create a new session if we don't have one
        setIsCreatingSession(true);
        const response = await fetch('/api/study-sessions', {
          method: 'POST',
        });
        
        if (!response.ok) throw new Error('Failed to create study session');
        
        const { session } = await response.json();
        setSessionId(session.id);
        setStartTime(new Date());
        
        // Update URL with session ID without triggering navigation
        window.history.replaceState(
          null, 
          '', 
          `/practice?session=${session.id}`
        );
      } catch (error) {
        console.error('Error creating study session:', error);
      } finally {
        setIsCreatingSession(false);
      }
    };

    // Call the function only once during component mount
    createStudySession();
  }, []); // Empty dependency array to run only once when component mounts

  // Fetch existing session details if we have a sessionId
  useEffect(() => {
    const fetchExistingSession = async () => {
      if (!sessionId || !hasActiveSubscription || !user) return;
      
      try {
        const response = await fetch(`/api/study-sessions/${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch session');
        
        const { session } = await response.json();
        
        // If this is a session being restored, set the start time
        if (session.startedAt) {
          setStartTime(new Date(session.startedAt));
        }
        
        // If session is completed, show congratulations
        if (session.status === 'completed') {
          setShowCongratulations(true);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };
    
    fetchExistingSession();
  }, [sessionId, hasActiveSubscription, user]);

  useEffect(() => {
    // Fetch questions from API
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions');
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    // Redirect if not subscribed
    if (isLoaded && !isLoading && !hasActiveSubscription) {
      router.push('/');
    }
  }, [isLoaded, isLoading, hasActiveSubscription, router]);
  
  // Save answer to the session
  const saveAnswer = async (questionId: string, selectedAnswer: string, isCorrect: boolean) => {
    if (!sessionId) return;
    
    try {
      const response = await fetch(`/api/study-sessions/${sessionId}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          selectedAnswer,
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to save answer:', await response.text());
      }
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };
  
  // Complete the session when user finishes
  const completeSession = async () => {
    if (!sessionId) return;
    
    const now = new Date();
    const durationMs = now.getTime() - startTime.getTime();
    const durationSecs = Math.floor(durationMs / 1000);
    
    try {
      const response = await fetch(`/api/study-sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          completedAt: now.toISOString(),
          durationSeconds: durationSecs
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to complete session:', await response.text());
      }
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };
  
  // Define goToNextQuestion before it's used in handleKeyDown
  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setQuestionsAnswered((prev) => prev + 1);
    } else {
      // Last question reviewed
      setQuestionsAnswered(questions.length);
      setShowCongratulations(true);
      completeSession();
    }
  }, [currentQuestionIndex, questions.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Numeric keys 1-3 for selecting options
      if (e.key === "1" && !isAnswerRevealed) {
        setSelectedOption('A');
      } else if (e.key === "2" && !isAnswerRevealed) {
        setSelectedOption('B');
      } else if (e.key === "3" && !isAnswerRevealed) {
        setSelectedOption('C');
      } else if (e.key === "4" && !isAnswerRevealed && questions[currentQuestionIndex]?.optionD) {
        setSelectedOption('D');
      }

      // Space or Enter to check answer or continue
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!isAnswerRevealed && selectedOption !== null) {
          handleCheckAnswer();
        } else if (isAnswerRevealed) {
          goToNextQuestion();
        }
      }
    },
    [isAnswerRevealed, selectedOption, goToNextQuestion]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const selectOption = (option: string) => {
    if (!isAnswerRevealed) {
      setSelectedOption(option);
    }
  };

  // Add a new function to handle checking answers
  const handleCheckAnswer = () => {
    if (!selectedOption || isAnswerRevealed || !currentQuestion) return;
    
    setIsAnswerRevealed(true);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    // Save answer to session
    if (sessionId && currentQuestion.id) {
      saveAnswer(currentQuestion.id, selectedOption, isCorrect);
    }
  };

  const progressPercentage = (questionsAnswered / questions.length) * 100;

  if (!isLoaded || isLoading || isLoadingQuestions || isCreatingSession) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!hasActiveSubscription) {
    return null; // Will be redirected by the useEffect
  }

  if (questions.length === 0) {
    return <div className="flex items-center justify-center h-screen">No questions available</div>;
  }
  
  if (showCongratulations) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Card className="max-w-lg w-full text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl">Congratulations! 🎉</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">You've completed all available questions!</p>
            <Button onClick={() => router.push('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const options = [
    { key: 'A', text: currentQuestion.optionA, number: '1' },
    { key: 'B', text: currentQuestion.optionB, number: '2' },
    { key: 'C', text: currentQuestion.optionC, number: '3' },
    { key: 'D', text: currentQuestion.optionD, number: '4' },
  ];

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/')}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
          <Badge variant="outline" className="ml-auto">
            Time: {elapsedTime}
          </Badge>
        </div>
      
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline" className="text-sm">
            Question {currentQuestionIndex + 1}/{questions.length}
          </Badge>
        </div>

        <Progress value={progressPercentage} className="mb-6" />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{currentQuestion.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-4">
              {options.map((option) => (
                <div
                  key={option.key}
                  className={`p-3 border rounded-lg cursor-pointer flex items-center ${
                    selectedOption === option.key 
                      ? "bg-primary/10 border-primary" 
                      : "hover:bg-muted/50"
                  } ${
                    isAnswerRevealed && option.key === currentQuestion.correctAnswer
                      ? "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500"
                      : ""
                  } ${
                    isAnswerRevealed &&
                    selectedOption === option.key &&
                    option.key !== currentQuestion.correctAnswer
                      ? "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-500"
                      : ""
                  }`}
                  onClick={() => selectOption(option.key)}
                >
                  <div className="flex-1">
                    <span className="font-medium mr-2">{option.number}.</span>
                    {option.text}
                  </div>
                  {isAnswerRevealed && option.key === currentQuestion.correctAnswer && (
                    <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                  )}
                  {isAnswerRevealed &&
                    selectedOption === option.key &&
                    option.key !== currentQuestion.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-500 ml-2" />
                  )}
                </div>
              ))}
            </div>

            {isAnswerRevealed && (
              <div className={`mt-6 p-4 rounded-lg border ${
                selectedOption && selectedOption === currentQuestion.correctAnswer
                  ? "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-500"
                  : "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-500"
              }`}>
                <h3 className="font-medium text-lg mb-2">Explanation:</h3>
                <p>{currentQuestion.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          {!isAnswerRevealed ? (
            <Button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className="w-full"
            >
              Check Answer{!isMobile && " (Space/Enter)"}
            </Button>
          ) : (
            <Button onClick={goToNextQuestion} className="w-full">
              Next Question{!isMobile && " (Space/Enter)"}
            </Button>
          )}
        </div>

        {!isMobile && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Keyboard shortcuts: Press 1-4 to select an option, Space or Enter to
              check/continue
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

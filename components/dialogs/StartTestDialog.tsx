"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { TestProgressBar } from "./TestProgressBar";

interface StartTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  testInfo?: { id: string; startedAt: string };
}

// Arrow SVG component
function ArrowStepSvg() {
  return (
    <svg
      width="20"
      height="10"
      viewBox="0 0 20 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-1"
    >
      <path
        d="M1 5H19M19 5L15 2M19 5L15 8"
        stroke="#2563eb"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Step progress bar component
function StepProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-4"> 
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'} flex items-center justify-center font-bold border-2 ${currentStep >= 1 ? 'border-blue-600' : 'border-gray-200'}`}>
            1
          </div>
          <span className={`text-xs mt-1 ${currentStep >= 1 ? 'font-semibold text-blue-700' : 'text-gray-500'} text-center leading-tight min-h-[2.2em]`}>
            Take Free
            <br />
            Test
          </span>
        </div>
        {/* Arrow SVG between steps */}
        <ArrowStepSvg />
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'} flex items-center justify-center font-bold border-2 ${currentStep >= 2 ? 'border-blue-600' : 'border-gray-200'}`}>
            2
          </div>
          <span className={`text-xs mt-1 ${currentStep >= 2 ? 'font-semibold text-blue-700' : 'text-gray-500'} text-center leading-tight min-h-[2.2em]`}>
            See Weak
            <br />
            Areas
          </span>
        </div>
        {/* Arrow SVG between steps */}
        <ArrowStepSvg />
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'} flex items-center justify-center font-bold border-2 ${currentStep >= 3 ? 'border-blue-600' : 'border-gray-200'}`}>
            3
          </div>
          <span className={`text-xs mt-1 ${currentStep >= 3 ? 'font-semibold text-blue-700' : 'text-gray-500'} text-center leading-tight min-h-[2.2em]`}>
            Unlock All
            <br />
            Tests
          </span>
        </div>
      </div>
    </div>
  );
}

function formatRelativeDate(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'in the future';
  if (diffDays === 0) return 'recently';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return 'a week ago';
  if (diffDays < 21) return 'two weeks ago';
  if (diffDays < 28) return 'three weeks ago';
  if (diffDays < 60) return 'a month ago';
  if (diffDays < 90) return 'two months ago';
  if (diffDays < 120) return 'three months ago';
  // Fallback to formatted date for older
  return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
}

export function StartTestDialog({ isOpen, onClose, testInfo }: StartTestDialogProps) {
  const [checking, setChecking] = useState(true);
  const [hasExistingTests, setHasExistingTests] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    setChecking(true);
    setError(null);
    fetch("/api/tests")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to check tests");
        const data = await res.json();
        setHasExistingTests(Array.isArray(data.tests) && data.tests.length > 0);
      })
      .catch((err) => {
        setError("Could not check your test status. Please refresh.");
        setHasExistingTests(null);
      })
      .finally(() => setChecking(false));
  }, [isOpen]);

  const isIncompleteTest = !!testInfo;

  const handleStartOrResumeTest = async () => {
    setIsStarting(true);
    setError(null);
    try {
      if (isIncompleteTest && testInfo) {
        // Resume the in-progress test
        router.push(`/test/${testInfo.id}`);
        onClose();
        return;
      }
      // Otherwise, create a new test
      const response = await fetch("/api/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "NEW" }),
      });
      if (!response.ok) {
        throw new Error("Failed to create test");
      }
      const data = await response.json();
      if (data?.test?.id) {
        setCurrentStep(2);
        router.push(`/test/${data.test.id}`);
        onClose();
      } else {
        throw new Error("No test ID received from server");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to start test");
    } finally {
      setIsStarting(false);
    }
  };

  // Only show dialog if it's open and not checking
  if (!isOpen || checking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] w-[90%] mx-auto rounded-md">
        <TestProgressBar currentStep={currentStep} />
        <DialogHeader>
          <DialogTitle>
            {isIncompleteTest ? "Finish What You Started!" : "Unlock Your Free DMV Practice Test"}
          </DialogTitle>
          <DialogDescription>
            {isIncompleteTest ? (
              testInfo ? (
                <>
                  You started a test {formatRelativeDate(testInfo.startedAt)} but didn't finish. Resume now to see your results and unlock new features!
                </>
              ) : (
                <>You started a test recently but didn't finish. Resume now to see your results and unlock new features!</>
              )
            ) : (
              <>Nervous about the DMV permit exam? Find out if you'd pass with our 36-question practice test.</>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex flex-col items-center justify-center gap-2 text-xs">
            <Button
              onClick={handleStartOrResumeTest}
              disabled={isStarting}
              size="lg"
              className="w-full"
            >
              {isStarting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isIncompleteTest ? (
                "Resume Test"
              ) : (
                "Start 36-question free test"
              )}
            </Button>
            {!isIncompleteTest && (
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <CreditCard className="w-4 h-4" />
                No payment or credit card required.
              </div>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

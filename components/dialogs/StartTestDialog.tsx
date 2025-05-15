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
import { Loader2 } from "lucide-react";

interface StartTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTest: () => void;
}

export function StartTestDialog({ isOpen, onClose, onStartTest }: StartTestDialogProps) {
  const [checking, setChecking] = useState(true);
  const [hasExistingTests, setHasExistingTests] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

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

  const handleStartTest = async () => {
    setIsStarting(true);
    try {
      await onStartTest();
      onClose();
    } finally {
      setIsStarting(false);
    }
  };

  // Only show dialog if user has no existing tests
  if (!isOpen || checking || hasExistingTests) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] w-[90%] mx-auto rounded-md">
        {/* Progress Bar with Steps */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold border-2 border-blue-600">1</div>
              <span className="text-xs mt-1 font-semibold text-blue-700">Take Free Test</span>
            </div>
            <div className="flex-1 h-1 bg-blue-200 mx-1" />
            <div className="flex-1 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold border-2 border-gray-200">2</div>
              <span className="text-xs mt-1 text-gray-500">See Weak Areas</span>
            </div>
            <div className="flex-1 h-1 bg-blue-200 mx-1" />
            <div className="flex-1 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold border-2 border-gray-200">3</div>
              <span className="text-xs mt-1 text-gray-500">Unlock All Tests</span>
            </div>
          </div>
        </div>
        <DialogHeader>
          <DialogTitle>Start your 36-question free test</DialogTitle>
          <DialogDescription>
            Ready to see how you'd do on the real DMV permit test? Start your free 36-question practice test now. No payment or credit card required.
          </DialogDescription>
        </DialogHeader>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <DialogFooter>
          <Button
            onClick={handleStartTest}
            disabled={isStarting}
            size="lg"
            className="w-full text-lg font-semibold"
          >
            {isStarting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start 36-question free test"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface IncompleteTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToTest: () => void;
  testInfo?: { startedAt: string };
}

export function IncompleteTestDialog({ isOpen, onClose, onGoToTest, testInfo }: IncompleteTestDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] w-[90%] mx-auto rounded-md">
        <DialogHeader>
          <DialogTitle>Finish What You Started</DialogTitle>
          <DialogDescription>
            {testInfo ? (
              <>
                You started a test on <b>{new Date(testInfo.startedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</b> but didn't finish. Resume now to see your results and unlock new features!
              </>
            ) : (
              <>You started a test recently but didn't finish. Resume now to see your results and unlock new features!</>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onGoToTest} className="w-full">
            Resume Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
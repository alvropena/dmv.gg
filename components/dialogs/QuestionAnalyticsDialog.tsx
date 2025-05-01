'use client';

import { Question } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuestionAnalyticsDialogProps {
  question: Question | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionAnalyticsDialog({ 
  question, 
  open, 
  onOpenChange 
}: QuestionAnalyticsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Question Analytics</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <p>Analytics for this question will be displayed here.</p>
          {question && (
            <p className="text-sm text-muted-foreground mt-2">
              Question: {question.title}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 
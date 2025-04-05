'use client';

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface DemoQuestionProps {
  question: string;
  options: string[];
  selectedOption: number | null;
  isAnswerRevealed: boolean;
  correctAnswer: number;
  onOptionSelect: (index: number) => void;
}

export function DemoQuestion({
  question,
  options,
  selectedOption,
  isAnswerRevealed,
  correctAnswer,
  onOptionSelect,
}: DemoQuestionProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">{question}</h2>
        <div className="space-y-3 mt-4">
          {options.map((option, index) => (
            <div
              key={index}
              className={`p-3 border rounded-lg cursor-pointer transition-colors flex items-center ${
                selectedOption === index
                  ? "border-primary bg-primary/10"
                  : "hover:bg-muted"
              } ${
                isAnswerRevealed && index === correctAnswer
                  ? "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-500"
                  : ""
              } ${
                isAnswerRevealed &&
                selectedOption === index &&
                index !== correctAnswer
                  ? "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-500"
                  : ""
              }`}
              onClick={() => onOptionSelect(index)}
            >
              <div className="flex-1">
                <span className="font-medium mr-2">{index + 1}.</span>
                {option}
              </div>
              {isAnswerRevealed && index === correctAnswer && (
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
              )}
              {isAnswerRevealed &&
                selectedOption === index &&
                index !== correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-500 ml-2" />
                )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
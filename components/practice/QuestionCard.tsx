import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import type { Question } from "@/types";
import { Button } from "@/components/ui/button";

interface QuestionCardProps {
  question: Question;
  selectedOption: string | null;
  isAnswerRevealed: boolean;
  onOptionSelect: (option: string) => void;
}

export function QuestionCard({
  question,
  selectedOption,
  isAnswerRevealed,
  onOptionSelect,
}: QuestionCardProps) {
  const options = [
    { key: "A", text: question.optionA, number: "1" },
    { key: "B", text: question.optionB, number: "2" },
    { key: "C", text: question.optionC, number: "3" },
  ];

  // Only add option D if it exists and has content
  if (question.optionD) {
    options.push({ key: "D", text: question.optionD, number: "4" });
  }

  return (
    <Card className="mb-6 mx-3 sm:mx-0">
      <CardHeader>
        <CardTitle className="text-xl">{question.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {options.map((option) => (
            <Button
              key={option.key}
              variant={selectedOption === option.key ? "secondary" : "outline"}
              className={`w-full justify-between ${
                isAnswerRevealed && option.key === question.correctAnswer
                  ? "bg-green-200/60"
                  : ""
              } ${
                isAnswerRevealed &&
                selectedOption === option.key &&
                option.key !== question.correctAnswer
                  ? "bg-red-200/60"
                  : ""
              }`}
              onClick={() => onOptionSelect(option.key)}
              aria-label={`Option ${option.number}: ${option.text}`}
            >
              <div className="text-left">{option.text}</div>
              {isAnswerRevealed && option.key === question.correctAnswer && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {isAnswerRevealed &&
                selectedOption === option.key &&
                option.key !== question.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
            </Button>
          ))}
        </div>

        {isAnswerRevealed && (
          <div className="mt-6 space-y-2 text-sm">
            <p>Explanation: {question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

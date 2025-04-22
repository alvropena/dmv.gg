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
        <CardTitle>{question.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mt-4">
          {options.map((option) => (
            <Button
              key={option.key}
              variant={selectedOption === option.key ? "secondary" : "outline"}
              className={`w-full justify-between ${
                isAnswerRevealed && option.key === question.correctAnswer
                  ? "bg-green-50 border-green-500"
                  : ""
              } ${
                isAnswerRevealed &&
                selectedOption === option.key &&
                option.key !== question.correctAnswer
                  ? "bg-red-100 border-red-3600"
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
          <div
            className={`mt-6 p-4 rounded-lg border ${
              selectedOption && selectedOption === question.correctAnswer
                ? "bg-green-100 border-green-500"
                : "bg-red-100 border-red-500"
            }`}
          >
            <h3 className="font-medium text-lg mb-2">Explanation:</h3>
            <p>{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

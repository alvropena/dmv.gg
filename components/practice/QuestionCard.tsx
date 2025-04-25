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
    <Card className="mb-6 sm:mx-0 shadow-none">
      <CardHeader className="px-6 md:px-8">
        <CardTitle className="text-xl md:text-2xl">{question.title}</CardTitle>
      </CardHeader>
      <CardContent className="px-6 md:px-8">
        <div className="space-y-3 md:space-y-4">
          {options.map((option) => (
            <Button
              key={option.key}
              variant={selectedOption === option.key ? "secondary" : "outline"}
              className={`w-full justify-between whitespace-normal text-left px-6 py-2.5 sm:px-4 sm:py-3 md:py-4 h-auto text-sm sm:text-base md:text-lg ${
                isAnswerRevealed && option.key === question.correctAnswer
                  ? "bg-green-200/60 border border-green-600"
                  : ""
              } ${
                isAnswerRevealed &&
                selectedOption === option.key &&
                option.key !== question.correctAnswer
                  ? "bg-red-200/60 border border-red-600"
                  : ""
              }`}
              onClick={() => onOptionSelect(option.key)}
              aria-label={`Option ${option.number}: ${option.text}`}
            >
              <div className="text-left flex-1 min-w-0 leading-relaxed">
                <span className="font-medium mr-3 text-sm sm:text-base md:text-lg">{option.key})</span>
                <span className="break-words text-sm sm:text-base md:text-lg">{option.text}</span>
              </div>
              {isAnswerRevealed && option.key === question.correctAnswer && (
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-500 flex-shrink-0" />
              )}
              {isAnswerRevealed &&
                selectedOption === option.key &&
                option.key !== question.correctAnswer && (
                  <XCircle className="h-5 w-5 md:h-6 md:w-6 text-red-500 flex-shrink-0" />
                )}
            </Button>
          ))}
        </div>

        {isAnswerRevealed && (
          <div className="mt-6 space-y-2">
            <p className="text-sm sm:text-base md:text-lg">Explanation: {question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

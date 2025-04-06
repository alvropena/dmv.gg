"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function TestDemo() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const handleSelectAnswer = (index: number) => {
    if (!isAnswered) {
      setSelectedAnswer(index)
    }
  }

  const checkAnswer = () => {
    setIsAnswered(true)
  }

  const resetQuestion = () => {
    setSelectedAnswer(null)
    setIsAnswered(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium">Question 1/5</div>
        <div className="text-sm font-medium">Score: 0</div>
      </div>
      <Progress value={20} className="h-2 mb-6" />

      <div className="space-y-6">
        <h3 className="text-lg font-bold">What does a red traffic light mean in California?</h3>

        <div className="space-y-3">
          <div
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedAnswer === 0
                ? isAnswered
                  ? "bg-red-50 border-red-300"
                  : "bg-blue-50 border-blue-300"
                : "hover:bg-gray-50"
            }`}
            onClick={() => handleSelectAnswer(0)}
          >
            <div className="flex items-start gap-3">
              <div className="font-medium">1.</div>
              <div>Slow down and proceed with caution</div>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedAnswer === 1
                ? isAnswered
                  ? "bg-green-50 border-green-300"
                  : "bg-blue-50 border-blue-300"
                : "hover:bg-gray-50"
            }`}
            onClick={() => handleSelectAnswer(1)}
          >
            <div className="flex items-start gap-3">
              <div className="font-medium">2.</div>
              <div>Stop and wait until the light turns green</div>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedAnswer === 2
                ? isAnswered
                  ? "bg-red-50 border-red-300"
                  : "bg-blue-50 border-blue-300"
                : "hover:bg-gray-50"
            }`}
            onClick={() => handleSelectAnswer(2)}
          >
            <div className="flex items-start gap-3">
              <div className="font-medium">3.</div>
              <div>Stop only if other vehicles are approaching</div>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedAnswer === 3
                ? isAnswered
                  ? "bg-red-50 border-red-300"
                  : "bg-blue-50 border-blue-300"
                : "hover:bg-gray-50"
            }`}
            onClick={() => handleSelectAnswer(3)}
          >
            <div className="flex items-start gap-3">
              <div className="font-medium">4.</div>
              <div>Yield to oncoming traffic</div>
            </div>
          </div>
        </div>

        {isAnswered ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-medium text-green-800">Correct Answer: 2. Stop and wait until the light turns green</p>
              <p className="mt-2 text-sm text-green-700">
                A red traffic light means you must come to a complete stop and wait for the light to turn green before
                proceeding.
              </p>
            </div>
            <Button onClick={resetQuestion} className="w-full">
              Next Question
            </Button>
          </div>
        ) : (
          <Button onClick={checkAnswer} disabled={selectedAnswer === null} className="w-full">
            Check Answer (Space)
          </Button>
        )}

        <div className="text-xs text-center text-gray-500 mt-4">
          Keyboard shortcuts: Press 1-4 to select an option, Space to check/continue
        </div>
      </div>
    </div>
  )
}


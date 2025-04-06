"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface PricingToggleProps {
  onToggle: (isAnnual: boolean) => void
}

export default function PricingToggle({ onToggle }: PricingToggleProps) {
  const [isAnnual, setIsAnnual] = useState(false)

  const handleToggle = () => {
    const newValue = !isAnnual
    setIsAnnual(newValue)
    onToggle(newValue)
  }

  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <span className={`text-sm font-medium ${!isAnnual ? "text-blue-600" : "text-gray-500"}`}>Pay as you go</span>
      <Button
        variant="outline"
        className={`relative rounded-full h-7 w-12 ${isAnnual ? "bg-blue-600" : "bg-gray-200"}`}
        onClick={handleToggle}
      >
        <span className="sr-only">Toggle pricing</span>
        <span
          className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform ${
            isAnnual ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </Button>
      <span className={`text-sm font-medium ${isAnnual ? "text-blue-600" : "text-gray-500"}`}>
        Save with annual billing
      </span>
    </div>
  )
}


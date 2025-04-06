import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-2">
          <div className="mb-2">{icon}</div>
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}


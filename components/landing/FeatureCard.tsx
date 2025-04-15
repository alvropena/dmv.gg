import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="overflow-hidden h-full rounded-xl">
      <CardContent className="p-8 flex flex-col justify-between h-full min-h-[400px]">
        <div className="mb-auto">
          <h3 className="font-bold text-2xl leading-tight">{title}</h3>
          <p className="mt-4 text-sm">{description}</p>
        </div>

        <div className="mt-auto pt-8 flex justify-center items-end h-[180px]">
          <div className="w-full h-full flex items-end justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


import type React from "react"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  change?: string
  trend?: "up" | "down" | "neutral"
  icon?: React.ReactNode
}

export function StatCard({ title, value, change, trend, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">{icon}</div>}
        </div>
        <div className="mt-2 flex items-baseline">
          <h3 className="text-2xl font-bold">{value}</h3>
          {change && (
            <p
              className={cn(
                "ml-2 text-xs font-medium",
                trend === "up" && "text-green-600 dark:text-green-400",
                trend === "down" && "text-red-600 dark:text-red-400",
              )}
            >
              {trend === "up" && <ArrowUpIcon className="mr-1 inline-block h-3 w-3" />}
              {trend === "down" && <ArrowDownIcon className="mr-1 inline-block h-3 w-3" />}
              {change}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


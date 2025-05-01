import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function PerformanceMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Performance</CardTitle>
        <CardDescription>Key metrics for the past 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">User Engagement</h4>
              <span className="text-sm text-green-600 font-medium">+8%</span>
            </div>
            <Progress value={78} className="h-2" />
            <p className="text-xs text-muted-foreground">
              78% of users complete at least one test per week
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Content Completion</h4>
              <span className="text-sm text-green-600 font-medium">+5%</span>
            </div>
            <Progress value={65} className="h-2" />
            <p className="text-xs text-muted-foreground">65% of users complete all study materials</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">First-Time Pass Rate</h4>
              <span className="text-sm text-amber-600 font-medium">-2%</span>
            </div>
            <Progress value={72} className="h-2" />
            <p className="text-xs text-muted-foreground">
              72% of users pass their DMV test on first attempt
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
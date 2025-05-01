import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { BarChart3, PieChart, Users } from "lucide-react"

export function ReportsTab() {
  return (
    <TabsContent value="reports" className="space-y-4 mt-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Performance</CardTitle>
            <CardDescription>Test scores and completion rates</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
              <Button variant="outline" className="mt-4">
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Content Effectiveness</CardTitle>
            <CardDescription>Question difficulty and success rates</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-center py-8">
              <PieChart className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
              <Button variant="outline" className="mt-4">
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Engagement</CardTitle>
            <CardDescription>Activity and retention metrics</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-center py-8">
              <Users className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
              <Button variant="outline" className="mt-4">
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Custom Reports</CardTitle>
          <CardDescription>Create custom reports with specific metrics and date ranges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Report Type</label>
              <select className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option>User Performance</option>
                <option>Content Analysis</option>
                <option>Revenue Report</option>
                <option>Engagement Metrics</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Date Range</label>
              <select className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Custom range</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Additional Metrics</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <input type="checkbox" id="pass-rate" className="mr-2" />
                  <label htmlFor="pass-rate" className="text-sm">
                    Pass Rate
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="time-spent" className="mr-2" />
                  <label htmlFor="time-spent" className="text-sm">
                    Time Spent
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="question-difficulty" className="mr-2" />
                  <label htmlFor="question-difficulty" className="text-sm">
                    Question Difficulty
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="user-demographics" className="mr-2" />
                  <label htmlFor="user-demographics" className="text-sm">
                    User Demographics
                  </label>
                </div>
              </div>
            </div>
          </div>
          <Button className="mt-4">Generate Custom Report</Button>
        </CardContent>
      </Card>
    </TabsContent>
  )
} 
import { AlertCircle, Flag, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function IssuesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
          <span>Issues Requiring Attention</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3 pb-3 border-b">
            <XCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-medium">Failed Questions Review</p>
              <p className="text-sm text-muted-foreground">5 questions have a failure rate above 80%</p>
              <Button variant="link" size="sm" className="px-0 h-auto">
                Review Questions
              </Button>
            </div>
          </div>
          <div className="flex items-start gap-3 pb-3 border-b">
            <Flag className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <p className="font-medium">Flagged Content</p>
              <p className="text-sm text-muted-foreground">
                3 questions have been flagged by users for review
              </p>
              <Button variant="link" size="sm" className="px-0 h-auto">
                Review Flags
              </Button>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium">Content Update Required</p>
              <p className="text-sm text-muted-foreground">
                California DMV regulations updated on 4/1/2025
              </p>
              <Button variant="link" size="sm" className="px-0 h-auto">
                Update Content
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
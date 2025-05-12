import {
  BarChart3,
  FileQuestion,
  FileText,
  ClipboardList,
  Users,
  Shield,
  Settings,
  PieChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddQuestionDialog } from "@/components/dialogs/AddQuestionDialog"

export function QuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Add New Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Create new questions, study materials, or practice tests.
          </p>
          <div className="flex flex-col gap-2">
            <AddQuestionDialog
              trigger={
                <Button size="sm" className="justify-start">
                  <FileQuestion className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              }
            />
            <Button size="sm" variant="outline" className="justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Add Study Material
            </Button>
            <Button size="sm" variant="outline" className="justify-start">
              <ClipboardList className="mr-2 h-4 w-4" />
              Create Practice Test
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Manage users, permissions, and account settings.
          </p>
          <div className="flex flex-col gap-2">
            <Button size="sm" className="justify-start">
              <Users className="mr-2 h-4 w-4" />
              View All Users
            </Button>
            <Button size="sm" variant="outline" className="justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Manage Permissions
            </Button>
            <Button size="sm" variant="outline" className="justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Analytics & Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            View detailed analytics and generate reports.
          </p>
          <div className="flex flex-col gap-2">
            <Button size="sm" className="justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              Performance Analytics
            </Button>
            <Button size="sm" variant="outline" className="justify-start">
              <PieChart className="mr-2 h-4 w-4" />
              Content Usage
            </Button>
            <Button size="sm" variant="outline" className="justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
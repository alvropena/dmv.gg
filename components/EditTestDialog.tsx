import { Test, TestType } from "@/types"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface EditTestDialogProps {
  test: Test | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTestDialog({ test, open, onOpenChange }: EditTestDialogProps) {
  const [selectedType, setSelectedType] = useState<TestType | "">("")
  const { toast } = useToast()

  const handleEditType = async () => {
    if (!test || !selectedType) return

    try {
      const response = await fetch(`/api/tests/${test.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: selectedType }),
      })

      if (!response.ok) throw new Error('Failed to update test')

      toast({
        title: "Success",
        description: "Test type updated successfully",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error updating test:", error)
      toast({
        title: "Error",
        description: "Failed to update test type",
        variant: "destructive",
      })
    }
  }

  // Reset selected type when dialog opens with a new test
  useEffect(() => {
    if (test) {
      setSelectedType(test.type)
    }
  }, [test])

  if (!test) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Test Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">ID</p>
            <p className="text-sm font-mono">{test.id}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Type</p>
            <Select
              value={selectedType}
              onValueChange={(value: TestType) => setSelectedType(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">New Test</SelectItem>
                <SelectItem value="REVIEW">Review</SelectItem>
                <SelectItem value="WEAK_AREAS">Weak Areas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <StatusBadge status={test.status} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
            <p className="text-sm font-medium">{test.totalQuestions}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Score</p>
            <p className={`text-sm font-medium ${
              test.status === 'completed' 
                ? test.score >= 89.13 
                  ? 'text-green-600' 
                  : 'text-red-600'
                : 'text-muted-foreground'
            }`}>
              {test.status === 'completed' ? `${test.score}%` : '-'}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Started</p>
            <p className="text-sm">
              {new Date(test.startedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Completed</p>
            <p className="text-sm">
              {test.completedAt 
                ? new Date(test.completedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : '-'
              }
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleEditType} 
            disabled={!selectedType || selectedType === test.type}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30"
        >
          Completed
        </Badge>
      )
    case "in_progress":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
        >
          In Progress
        </Badge>
      )
    default:
      return null
  }
}
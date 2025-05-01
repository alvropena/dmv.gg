"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Test = {
  id: string
  userId: string
  userName: string
  userEmail: string
  type: 'NEW' | 'REVIEW' | 'WEAK_AREAS'
  totalQuestions: number
  completedQuestions: number
  correctAnswers: number
  status: 'completed' | 'in_progress'
  score: number
  startedAt: string
  completedAt?: string
}

type SortField = "userName" | "completedQuestions" | "score" | "status" | "startedAt" | "type"
type SortDirection = "asc" | "desc"

export function TestsTab() {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<SortField>("startedAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/tests/all')
        if (!response.ok) throw new Error('Failed to fetch tests')
        const data = await response.json()
        setTests(data)
      } catch (error) {
        console.error("Error fetching tests:", error)
        toast({
          title: "Error",
          description: "Failed to fetch tests",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [toast])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedTests = [...tests].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1

    switch (sortField) {
      case "userName":
        return direction * a.userName.localeCompare(b.userName)
      case "completedQuestions":
        return direction * (a.completedQuestions - b.completedQuestions)
      case "score":
        return direction * (a.score - b.score)
      case "status":
        return direction * a.status.localeCompare(b.status)
      case "startedAt":
        return direction * (new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
      case "type":
        return direction * a.type.localeCompare(b.type)
      default:
        return 0
    }
  })

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Tests</h2>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b transition-colors hover:bg-muted/5">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      ID
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("userName")}
                        className="flex items-center gap-1 -ml-4 h-12 hover:bg-transparent"
                      >
                        User
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("completedQuestions")}
                        className="flex items-center gap-1 -ml-4 h-12 hover:bg-transparent"
                      >
                        Questions Done
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("score")}
                        className="flex items-center gap-1 -ml-4 h-12 hover:bg-transparent"
                      >
                        Score
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("type")}
                        className="flex items-center gap-1 -ml-4 h-12 hover:bg-transparent"
                      >
                        Type
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-1 -ml-4 h-12 hover:bg-transparent"
                      >
                        Status
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("startedAt")}
                        className="flex items-center gap-1 -ml-4 h-12 hover:bg-transparent"
                      >
                        Started
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Completed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center">
                        Loading tests...
                      </td>
                    </tr>
                  ) : sortedTests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center">
                        No tests found.
                      </td>
                    </tr>
                  ) : (
                    sortedTests.map((test) => (
                      <tr 
                        key={test.id} 
                        onClick={() => setSelectedTest(test)}
                        className="border-b transition-colors hover:bg-muted/5 cursor-pointer"
                      >
                        <td className="p-4 align-middle text-muted-foreground">
                          {test.id.slice(0, 8)}
                        </td>
                        <td className="p-4 align-middle">
                          <div>
                            <p className="font-medium">{test.userName}</p>
                            <p className="text-muted-foreground">{test.userEmail}</p>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <span className={test.status === 'completed' ? 'text-green-600 font-medium' : 'text-blue-600 font-medium'}>
                            {test.completedQuestions}/{test.totalQuestions}
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          {test.status === 'in_progress' ? (
                            <span className="text-muted-foreground">-</span>
                          ) : (
                            <span className={test.score >= 89.13 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                              {test.score}%
                            </span>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          <TestTypeBadge type={test.type} />
                        </td>
                        <td className="p-4 align-middle">
                          <StatusBadge status={test.status} />
                        </td>
                        <td className="p-4 align-middle">
                          {new Date(test.startedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="p-4 align-middle">
                          <span className={test.completedAt ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                            {test.completedAt ? 'True' : 'False'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Test Details</DialogTitle>
          </DialogHeader>
          {selectedTest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User</p>
                  <p className="text-sm">{selectedTest.userName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <TestTypeBadge type={selectedTest.type} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <StatusBadge status={selectedTest.status} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Questions Completed</p>
                  <p className="text-sm font-medium">
                    {selectedTest.completedQuestions}/{selectedTest.totalQuestions}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Score</p>
                  <p className={`text-sm font-medium ${
                    selectedTest.status === 'completed' 
                      ? selectedTest.score >= 89.13 
                        ? 'text-green-600' 
                        : 'text-red-600'
                      : 'text-muted-foreground'
                  }`}>
                    {selectedTest.status === 'completed' ? `${selectedTest.score}%` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Started</p>
                  <p className="text-sm">
                    {new Date(selectedTest.startedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-sm">
                    {selectedTest.completedAt 
                      ? new Date(selectedTest.completedAt).toLocaleDateString('en-US', {
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
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Performance</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3">
                    <p className="text-sm font-medium">Correct Answers</p>
                    <p className="text-2xl font-bold text-green-600">{selectedTest.correctAnswers}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm font-medium">Incorrect Answers</p>
                    <p className="text-2xl font-bold text-red-600">
                      {selectedTest.completedQuestions - selectedTest.correctAnswers}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
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

function TestTypeBadge({ type }: { type: string }) {
  switch (type) {
    case "NEW":
      return (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30"
        >
          New Test
        </Badge>
      )
    case "REVIEW":
      return (
        <Badge
          variant="outline"
          className="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30"
        >
          Review
        </Badge>
      )
    case "WEAK_AREAS":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30"
        >
          Weak Areas
        </Badge>
      )
    default:
      return null
  }
} 
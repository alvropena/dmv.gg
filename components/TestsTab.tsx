"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

type Test = {
  id: string
  userId: string
  userName: string
  totalQuestions: number
  correctAnswers: number
  status: 'completed' | 'in_progress'
  score: number
  startedAt: string
  completedAt?: string
}

type SortField = "userName" | "totalQuestions" | "score" | "status" | "startedAt"
type SortDirection = "asc" | "desc"

export function TestsTab() {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<SortField>("startedAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
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
  }, [])

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
      case "totalQuestions":
        return direction * (a.totalQuestions - b.totalQuestions)
      case "score":
        return direction * (a.score - b.score)
      case "status":
        return direction * a.status.localeCompare(b.status)
      case "startedAt":
        return direction * (new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
      default:
        return 0
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Tests</h2>
      </div>
      
      <div className="rounded-md border">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("userName")}
                    className="flex items-center gap-1 mx-auto"
                  >
                    User
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </th>
                <th className="px-4 py-3 font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("totalQuestions")}
                    className="flex items-center gap-1 mx-auto"
                  >
                    Questions
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </th>
                <th className="px-4 py-3 font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("score")}
                    className="flex items-center gap-1 mx-auto"
                  >
                    Score
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </th>
                <th className="px-4 py-3 font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-1 mx-auto"
                  >
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </th>
                <th className="px-4 py-3 font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("startedAt")}
                    className="flex items-center gap-1 mx-auto"
                  >
                    Started
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </th>
                <th className="px-4 py-3 font-medium text-center">Completed</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-center">
                    Loading tests...
                  </td>
                </tr>
              ) : sortedTests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-center">
                    No tests found.
                  </td>
                </tr>
              ) : (
                sortedTests.map((test) => (
                  <tr key={test.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3 text-center">{test.userName}</td>
                    <td className="px-4 py-3 text-center">{test.totalQuestions}</td>
                    <td className="px-4 py-3 text-center">
                      {test.status === 'in_progress' ? (
                        <span className="text-gray-500">-</span>
                      ) : (
                        <span className={test.score >= 89.13 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {test.score}%
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={test.status} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {new Date(test.startedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3 text-center">
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
      </div>
    </div>
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
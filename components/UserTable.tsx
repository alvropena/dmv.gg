"use client"
import { CheckCircle, MoreHorizontal, Shield, XCircle, ArrowUpDown, Glasses } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { getUsers } from "@/app/actions/users"
import { useToast } from "@/hooks/use-toast"

type User = {
  id: string
  name: string
  email: string
  role: string
  joined: string
  tests: number
  avgScore: string
  passed: boolean
  birthday?: Date | null
}

type SortField = "status" | "role" | "joined" | "tests" | "avgScore" | "age"
type SortDirection = "asc" | "desc"

export function UserTable({ searchQuery }: { searchQuery?: string }) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<SortField>("joined")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const { toast } = useToast()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const data = await getUsers(searchQuery)
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [searchQuery, toast])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedUsers = [...users].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1

    switch (sortField) {
      case "role":
        return direction * a.role.localeCompare(b.role)
      case "joined":
        return direction * new Date(a.joined).getTime() - new Date(b.joined).getTime()
      case "tests":
        return direction * (a.tests - b.tests)
      case "avgScore":
        return direction * (parseInt(a.avgScore) - parseInt(b.avgScore))
      case "age":
        return direction * (new Date(a.birthday || "").getTime() - new Date(b.birthday || "").getTime())
      default:
        return 0
    }
  })

  return (
    <div className="w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="border-b">
          <tr className="text-left">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">
              <Button
                variant="ghost"
                onClick={() => handleSort("age")}
                className="flex items-center gap-1 mx-auto"
              >
                Age
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </th>
            <th className="px-4 py-3 font-medium">
              <Button
                variant="ghost"
                onClick={() => handleSort("role")}
                className="flex items-center gap-1 mx-auto"
              >
                Role
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </th>
            <th className="px-4 py-3 font-medium">
              <Button
                variant="ghost"
                onClick={() => handleSort("joined")}
                className="flex items-center gap-1 mx-auto"
              >
                Joined
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </th>
            <th className="px-4 py-3 font-medium">
              <Button
                variant="ghost"
                onClick={() => handleSort("tests")}
                className="flex items-center gap-1 mx-auto"
              >
                Tests
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </th>
            <th className="px-4 py-3 font-medium">
              <Button
                variant="ghost"
                onClick={() => handleSort("avgScore")}
                className="flex items-center gap-1 mx-auto"
              >
                Avg. Score
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </th>
            <th className="px-4 py-3 font-medium sr-only">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="px-4 py-3 text-center">
                Loading users...
              </td>
            </tr>
          ) : sortedUsers.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-3 text-center">
                No users found.
              </td>
            </tr>
          ) : (
            sortedUsers.map((user) => (
              <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  {user.birthday ? (
                    Math.floor((new Date().getTime() - new Date(user.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center">
                    <RoleBadge role={user.role} />
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  {new Date(user.joined).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-4 py-3 text-center">{user.tests}</td>
                <td className="px-4 py-3 flex justify-center">
                  <Badge
                    variant="outline"
                    className={`${user.passed 
                      ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30' 
                      : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
                    } w-16 flex items-center justify-center`}
                  >
                    {user.avgScore}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuItem>View Test History</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Suspend User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  switch (role?.toUpperCase()) {
    case "ADMIN":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30 w-20"
        >
          <Shield className="mr-1 h-3 w-3" />
          Admin
        </Badge>
      )
    case "STUDENT":
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-gray-900/30 w-20"
        >
          <Glasses className="mr-1 h-3 w-3" />
          Student
        </Badge>
      )
    default:
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-gray-900/30 w-20"
        >
          <Glasses className="mr-1 h-3 w-3" />
          {role || 'Student'}
        </Badge>
      )
  }
}


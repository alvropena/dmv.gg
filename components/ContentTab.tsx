'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { ChevronDown, ArrowDownAZ, ArrowUpAZ, Search } from "lucide-react"
import { QuestionTable, SortDirection, SortField } from "@/components/QuestionTable"
import { AddQuestionDialog } from "@/components/AddQuestionDialog"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function SortIcon({ direction }: { direction: SortDirection | null }) {
  if (direction === "asc") return <ArrowUpAZ className="h-4 w-4" />
  if (direction === "desc") return <ArrowDownAZ className="h-4 w-4" />
  return <ChevronDown className="h-4 w-4" />
}

export function ContentTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleQuestionAdded = () => {
    // Increment the refreshKey to trigger a refresh of the QuestionTable
    setRefreshKey(prev => prev + 1)
  }

  return (
    <TabsContent value="content" className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search questions..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SortIcon direction={sortDirection} />
                <span className="ml-2 text-xs hidden sm:inline">
                  {sortField === "title" && "Sort by Question"}
                  {sortField === "correctAnswer" && "Sort by Answer"}
                  {sortField === "createdAt" && (sortDirection === "desc" ? "Latest" : "Oldest")}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setSortField("title")
                setSortDirection("asc")
              }}>
                Sort by Question
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSortField("correctAnswer")
                setSortDirection("asc")
              }}>
                Sort by Answer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSortField("createdAt")
                setSortDirection("desc")
              }}>
                Latest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSortField("createdAt")
                setSortDirection("asc")
              }}>
                Oldest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <AddQuestionDialog onQuestionAdded={handleQuestionAdded} />
      </div>
      
      <Card>
        <CardContent className="p-0">
          <QuestionTable 
            key={refreshKey} 
            searchQuery={searchQuery} 
            sortField={sortField}
            sortDirection={sortDirection}
          />
        </CardContent>
      </Card>
    </TabsContent>
  )
} 
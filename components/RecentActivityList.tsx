"use client"

import { BookOpen, ClipboardList, Flag, MessageSquare, User, UserPlus } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "user_registered",
    user: "Sarah Johnson",
    time: "10 minutes ago",
  },
  {
    id: 2,
    type: "test_completed",
    user: "John Smith",
    test: "California Road Signs",
    score: "92%",
    time: "25 minutes ago",
  },
  {
    id: 3,
    type: "question_flagged",
    user: "Michael Brown",
    questionId: "Q-1005",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "content_added",
    admin: "Emily Davis",
    contentType: "Study Material",
    content: "New York Traffic Laws",
    time: "2 hours ago",
  },
  {
    id: 5,
    type: "support_ticket",
    user: "Robert Wilson",
    ticketId: "T-4523",
    time: "3 hours ago",
  },
]

export function RecentActivityList() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
          <ActivityIcon type={activity.type} />
          <div>
            <ActivityContent activity={activity} />
            <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case "user_registered":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
          <UserPlus className="h-4 w-4" />
        </div>
      )
    case "test_completed":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
          <ClipboardList className="h-4 w-4" />
        </div>
      )
    case "question_flagged":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <Flag className="h-4 w-4" />
        </div>
      )
    case "content_added":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
          <BookOpen className="h-4 w-4" />
        </div>
      )
    case "support_ticket":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
          <MessageSquare className="h-4 w-4" />
        </div>
      )
    default:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400">
          <User className="h-4 w-4" />
        </div>
      )
  }
}

function ActivityContent({ activity }: { activity: any }) {
  switch (activity.type) {
    case "user_registered":
      return (
        <p className="text-sm">
          <span className="font-medium">{activity.user}</span> registered a new account
        </p>
      )
    case "test_completed":
      return (
        <p className="text-sm">
          <span className="font-medium">{activity.user}</span> completed{" "}
          <span className="font-medium">{activity.test}</span> with a score of{" "}
          <span className="font-medium">{activity.score}</span>
        </p>
      )
    case "question_flagged":
      return (
        <p className="text-sm">
          <span className="font-medium">{activity.user}</span> flagged question{" "}
          <span className="font-medium">{activity.questionId}</span> for review
        </p>
      )
    case "content_added":
      return (
        <p className="text-sm">
          <span className="font-medium">{activity.admin}</span> added new{" "}
          <span className="font-medium">{activity.contentType}</span>:{" "}
          <span className="font-medium">{activity.content}</span>
        </p>
      )
    case "support_ticket":
      return (
        <p className="text-sm">
          <span className="font-medium">{activity.user}</span> opened support ticket{" "}
          <span className="font-medium">{activity.ticketId}</span>
        </p>
      )
    default:
      return <p className="text-sm">Unknown activity</p>
  }
}


"use client"

import Link from "next/link"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"
import { Bell, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AdminHeader() {
  const { user } = useUser();
  
  return (
    <header className="sticky top-0 z-10 border-b bg-white dark:bg-gray-950 dark:border-gray-800">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Link href="/admin" className="flex items-center">
            <Image
              src="/logo.png"
              alt="DMV Logo"
              width={60}
              height={20}
              className="h-auto w-auto rounded-full"
              priority
            />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-64 rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                <DropdownMenuItem className="flex flex-col items-start py-2">
                  <p className="font-medium">New User Registration</p>
                  <p className="text-xs text-muted-foreground">John Smith just created an account</p>
                  <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start py-2">
                  <p className="font-medium">Content Flagged</p>
                  <p className="text-xs text-muted-foreground">Question #342 has been flagged for review</p>
                  <p className="text-xs text-muted-foreground mt-1">15 minutes ago</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start py-2">
                  <p className="font-medium">System Update</p>
                  <p className="text-xs text-muted-foreground">Platform update completed successfully</p>
                  <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center font-medium">View All Notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>System Settings</DropdownMenuItem>
              <DropdownMenuItem>Appearance</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'Admin'} />
                <AvatarFallback>
                  {user?.fullName?.[0]?.toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Admin profile</span>
            </Button>
            <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white" />
          </div>
        </div>
      </div>
    </header>
  )
}


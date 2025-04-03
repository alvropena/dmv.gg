'use client'

import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ArrowRight, Home, LayoutDashboard } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleGetStarted = () => {
    router.push('/sign-in');
  };

  return (
    <header className="w-full border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <h1 className="text-xl font-bold bg-blue-600 text-white px-3 py-1 rounded">
              DMV.gg
            </h1>
          </Link>
          
          <div className="flex items-center gap-4">
            <SignedIn>
              <nav className="flex items-center gap-4">
                <Link href="/" className={`text-sm ${pathname === '/' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  <span className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    Home
                  </span>
                </Link>
                <Link href="/dashboard" className={`text-sm ${pathname === '/dashboard' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  <span className="flex items-center gap-1">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </span>
                </Link>
              </nav>
            </SignedIn>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SignedOut>
              <Button onClick={handleGetStarted}>
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
}

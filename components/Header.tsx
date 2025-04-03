'use client'

import {
  SignedIn,
  SignedOut,
  UserButton,
  useAuth
} from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function Header() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSignedIn) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  const handleGetStarted = () => {
    router.push('/sign-in');
  };

  return (
    <header className="w-full border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <a href="#" onClick={handleLogoClick}>
            <h1 className="text-xl font-bold bg-blue-600 text-white px-3 py-1 rounded">
              DMV.gg
            </h1>
          </a>
          
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

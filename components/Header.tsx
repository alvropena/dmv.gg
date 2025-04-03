import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { LogIn, UserPlus } from 'lucide-react'

export function Header() {
  return (
    <header className="w-full border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold bg-blue-600 text-white px-3 py-1.5 rounded">
            DMV.gg
          </h1>
          <div className="flex items-center gap-2">
            <SignedOut>
              <Button variant="outline" >
                <LogIn className="h-4 w-4" />
                Log In
              </Button>
              <Button >
                <UserPlus className="h-4 w-4" />
                Get Started
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
}

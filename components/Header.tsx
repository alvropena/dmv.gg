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
import { useAuthContext } from '@/contexts/AuthContext'
import { useState } from 'react'
import { PricingDialog } from '@/components/PricingDialog'

export function Header() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { dbUser, isLoading, hasActiveSubscription } = useAuthContext();
  const [isPricingOpen, setIsPricingOpen] = useState(false);

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

  const handleUpgrade = () => {
    setIsPricingOpen(true);
  };

  const handlePlanSelect = async (plan: 'weekly' | 'monthly' | 'lifetime') => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
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
                {!hasActiveSubscription && (
                  <Button onClick={handleUpgrade} variant="outline" className="mr-2">
                    Upgrade
                  </Button>
                )}
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      <PricingDialog
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onPlanSelect={(plan) => {
          handlePlanSelect(plan);
          setIsPricingOpen(false);
        }}
      />
    </>
  )
}

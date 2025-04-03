'use client';

import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowRight, BookOpen, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { dbUser } = useAuthContext();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // If not authenticated, redirect to sign-in
    router.push('/sign-in');
    return null;
  }

  // Get user's first name or full name
  const firstName = user.firstName || user.fullName?.split(' ')[0] || 'there';

  const handleLearnClick = () => {
    if (!dbUser?.hasActiveSubscription) {
      toast.error('Please upgrade to access the learning materials');
      return;
    }
    router.push('/learn');
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back, {firstName}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Glad to see you again. Ready to continue your DMV test practice?
          </p>
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <Button onClick={() => router.push('/')} className="flex items-center gap-2">
              Practice Test <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleLearnClick}
              variant="outline"
              className="flex items-center gap-2"
            >
              {!dbUser?.hasActiveSubscription && <Lock className="h-4 w-4 mr-1" />}
              <BookOpen className="h-4 w-4" />
              Learn DMV Rules
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
                <h3 className="font-semibold text-xl">0</h3>
                <p className="text-muted-foreground text-sm">Tests Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <h3 className="font-semibold text-xl">0%</h3>
                <p className="text-muted-foreground text-sm">Average Score</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <h3 className="font-semibold text-xl">0</h3>
                <p className="text-muted-foreground text-sm">Streak</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
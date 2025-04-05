import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user from the database
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all completed tests for the user
    const completedTests = await db.test.findMany({
      where: { 
        userId: dbUser.id,
        status: 'completed'
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    // Calculate study streak
    // A streak is the number of consecutive days with completed tests
    let streak = 0;
    
    if (completedTests.length > 0) {
      // Get all unique dates when tests were completed
      const testDatesSet = new Set<string>();
      
      completedTests
        .filter(test => test.completedAt !== null)
        .forEach(test => {
          const date = new Date(test.completedAt as Date);
          testDatesSet.add(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
        });
      
      const testDates = Array.from(testDatesSet).sort().reverse(); // Sort in descending order
      
      // Start with today
      const today = new Date();
      const todayString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      
      // Check if the user has a test today
      const hasTestToday = testDates[0] === todayString;
      
      if (hasTestToday) {
        streak = 1;
        
        // Check previous days
        const checkDay = new Date(today);
        
        for (let i = 1; i < 100; i++) { // Limit to reasonable number
          checkDay.setDate(checkDay.getDate() - 1);
          const checkDayString = `${checkDay.getFullYear()}-${checkDay.getMonth() + 1}-${checkDay.getDate()}`;
          
          if (testDates.includes(checkDayString)) {
            streak++;
          } else {
            break; // Streak is broken
          }
        }
      }
    }

    return NextResponse.json({ 
      streak,
      tests: completedTests.map(test => ({
        id: test.id,
        startedAt: test.startedAt,
        completedAt: test.completedAt,
        durationSeconds: test.durationSeconds,
        score: test.score,
        totalQuestions: test.totalQuestions
      }))
    });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user activity' },
      { status: 500 }
    );
  }
} 
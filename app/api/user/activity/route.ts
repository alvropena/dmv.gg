import { NextResponse } from 'next/server';
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

    // Get ALL tests for the user (both completed and in-progress)
    const allTests = await db.test.findMany({
      where: { 
        userId: dbUser.id
      },
      orderBy: {
        startedAt: 'desc'
      }
    });

    // Calculate total study time from all tests (including in-progress)
    let totalStudyTimeSeconds = 0;
    
    allTests.forEach(test => {
      if (test.durationSeconds) {
        totalStudyTimeSeconds += test.durationSeconds;
      }
    });

    // Calculate study streak
    // A streak is the number of consecutive days with activity (both completed and in-progress tests)
    let streak = 0;
    
    if (allTests.length > 0) {
      // Get all unique dates when user had activity
      const activityDatesSet = new Set<string>();
      
      allTests.forEach(test => {
        // Use completedAt for completed tests, or startedAt for in-progress
        const date = new Date(test.completedAt || test.startedAt);
        activityDatesSet.add(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
      });
      
      const activityDates = Array.from(activityDatesSet).sort().reverse(); // Sort in descending order
      
      // Start with today
      const today = new Date();
      const todayString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      
      // Check if the user has activity today
      const hasActivityToday = activityDates.includes(todayString);
      
      if (hasActivityToday) {
        streak = 1;
        
        // Check previous days
        const checkDay = new Date(today);
        
        for (let i = 1; i < 100; i++) { // Limit to reasonable number
          checkDay.setDate(checkDay.getDate() - 1);
          const checkDayString = `${checkDay.getFullYear()}-${checkDay.getMonth() + 1}-${checkDay.getDate()}`;
          
          if (activityDates.includes(checkDayString)) {
            streak++;
          } else {
            break; // Streak is broken
          }
        }
      }
    }

    // Format total study time
    let totalStudyTimeFormatted = "";
    const totalMinutes = Math.floor(totalStudyTimeSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      totalStudyTimeFormatted = `${hours}h ${minutes}m`;
    } else {
      totalStudyTimeFormatted = `${minutes}m`;
    }

    return NextResponse.json({ 
      streak,
      totalStudyTimeSeconds,
      totalStudyTimeFormatted,
      tests: allTests.map(test => ({
        id: test.id,
        status: test.status,
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
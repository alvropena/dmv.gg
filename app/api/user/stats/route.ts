import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

// Get user study statistics
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

    // Get current date and date from one week ago
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

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

    // Get completed tests from the last week
    const lastWeekCompletedTests = await db.test.findMany({
      where: { 
        userId: dbUser.id,
        status: 'completed',
        completedAt: {
          gte: oneWeekAgo,
          lte: now,
        }
      },
    });

    // Get tests from the week before that for comparison
    const twoWeeksAgo = new Date(oneWeekAgo);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);
    
    const previousWeekCompletedTests = await db.test.findMany({
      where: { 
        userId: dbUser.id,
        status: 'completed',
        completedAt: {
          gte: twoWeeksAgo,
          lt: oneWeekAgo,
        }
      },
    });

    // Calculate the difference from previous week
    const weeklyDifference = lastWeekCompletedTests.length - previousWeekCompletedTests.length;

    // Calculate average score for all completed tests
    let averageScore = 0;
    if (completedTests.length > 0) {
      const totalScore = completedTests.reduce((sum: number, test: any) => sum + test.score, 0);
      averageScore = Math.round(totalScore / completedTests.length);
    }

    // Get the last test score if available
    const lastTest = completedTests[0]; // They are ordered by completedAt desc
    const lastScore = lastTest ? lastTest.score : 0;
    
    // Calculate score difference between last two tests
    let scoreDifference = 0;
    if (completedTests.length >= 2) {
      scoreDifference = lastTest.score - completedTests[1].score;
    }

    return NextResponse.json({ 
      stats: {
        totalCompleted: completedTests.length,
        weeklyDifference: weeklyDifference,
        averageScore,
        lastScore,
        scoreDifference
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
} 
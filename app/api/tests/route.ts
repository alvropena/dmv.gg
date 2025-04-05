import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

// Maximum number of questions per test
const MAX_QUESTIONS_PER_TEST = 46;

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Create a new test
export async function POST() {
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

    // Get all questions 
    const allQuestions = await db.question.findMany();
    
    // Shuffle and select a random subset (up to MAX_QUESTIONS_PER_TEST)
    const shuffledQuestions = shuffleArray(allQuestions);
    const selectedQuestions = shuffledQuestions.slice(0, MAX_QUESTIONS_PER_TEST);
    
    // Create a new test
    const test = await db.test.create({
      data: {
        userId: dbUser.id,
        totalQuestions: selectedQuestions.length,
        status: 'in_progress',
      },
    });

    // Create TestQuestion entries for the selected questions
    for (let i = 0; i < selectedQuestions.length; i++) {
      await db.testQuestion.create({
        data: {
          testId: test.id,
          questionId: selectedQuestions[i].id,
          order: i,
        },
      });
    }

    // Create initial test answers for the selected questions
    for (const question of selectedQuestions) {
      await db.testAnswer.create({
        data: {
          testId: test.id,
          questionId: question.id,
        },
      });
    }

    return NextResponse.json({ test });
  } catch (error) {
    console.error('Error creating test:', error);
    return NextResponse.json(
      { error: 'Failed to create test' },
      { status: 500 }
    );
  }
}

// Get all tests for the current user
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

    // Get tests with their answers
    const tests = await db.test.findMany({
      where: { 
        userId: dbUser.id 
      },
      orderBy: {
        startedAt: 'desc'
      },
      include: {
        answers: true
      }
    });

    return NextResponse.json({ tests });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
} 
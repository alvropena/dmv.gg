import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { Question } from '@/types';

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

// Create a new study session
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
    
    // Create a new study session
    const session = await db.studySession.create({
      data: {
        userId: dbUser.id,
        totalQuestions: selectedQuestions.length,
        status: 'in_progress',
      },
    });

    // Create SessionQuestion entries for the selected questions
    await Promise.all(
      selectedQuestions.map((question, index) =>
        db.sessionQuestion.create({
          data: {
            sessionId: session.id,
            questionId: question.id,
            order: index,
          },
        })
      )
    );

    // Create initial session answers for the selected questions
    await Promise.all(
      selectedQuestions.map((question) =>
        db.sessionAnswer.create({
          data: {
            sessionId: session.id,
            questionId: question.id,
          },
        })
      )
    );

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error creating study session:', error);
    return NextResponse.json(
      { error: 'Failed to create study session' },
      { status: 500 }
    );
  }
}

// Get all study sessions for the current user
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

    // Get all study sessions for the user
    const sessions = await db.studySession.findMany({
      where: { userId: dbUser.id },
      orderBy: { startedAt: 'desc' },
      include: {
        answers: {
          include: {
            question: true
          }
        },
      },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching study sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study sessions' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

// Create a new test with specific question IDs
export async function POST(request: Request) {
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

    // Get question IDs from request body
    const body = await request.json();
    let questionIds = body.questionIds || [];

    // If no specific question IDs provided, get all questions and shuffle them
    if (questionIds.length === 0) {
      const allQuestions = await db.question.findMany({
        select: { id: true }
      });
      
      // Shuffle and select random questions
      const shuffledQuestions = shuffleArray(allQuestions);
      // Use up to 5 questions for the test
      const selectedQuestions = shuffledQuestions.slice(0, 5);
      questionIds = selectedQuestions.map(q => q.id);
    }

    // Fetch the actual questions
    const questions = await db.question.findMany({
      where: {
        id: {
          in: questionIds
        }
      }
    });

    // Create a new test
    const test = await db.test.create({
      data: {
        userId: dbUser.id,
        totalQuestions: questions.length,
        status: 'in_progress',
      },
    });

    // Create TestQuestion entries for the selected questions
    for (let i = 0; i < questions.length; i++) {
      await db.testQuestion.create({
        data: {
          testId: test.id,
          questionId: questions[i].id,
          order: i,
        },
      });
    }

    // Create initial test answers for the selected questions
    for (const question of questions) {
      await db.testAnswer.create({
        data: {
          testId: test.id,
          questionId: question.id,
        },
      });
    }

    return NextResponse.json({ test });
  } catch (error) {
    console.error('Error creating custom test:', error);
    return NextResponse.json(
      { error: 'Failed to create custom test' },
      { status: 500 }
    );
  }
}

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
} 
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get testId from query parameters instead of path params
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');

    if (!testId) {
      return NextResponse.json({ error: 'Test ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { questionId, selectedAnswer } = body;

    // Check if the test belongs to the user
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const test = await db.test.findUnique({
      where: {
        id: testId,
        userId: dbUser.id,
      },
    });

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found or unauthorized' },
        { status: 404 }
      );
    }

    // Get the question to check if the answer is correct
    const question = await db.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Check if the answer is correct
    const isCorrect = selectedAnswer === question.correctAnswer;

    // Record the answer
    const answer = await db.testAnswer.update({
      where: {
        testId_questionId: {
          testId: testId,
          questionId,
        },
      },
      data: {
        selectedAnswer,
        isCorrect,
        answeredAt: new Date(),
      },
    });

    // If this is a completed test, update score
    if (test.status === 'in_progress') {
      // Count correct answers
      const answers = await db.testAnswer.findMany({
        where: {
          testId: testId,
          isCorrect: true,
        },
      });

      // Calculate score percentage (0-100)
      const correctCount = answers.length;
      const totalQuestions = test.totalQuestions;
      const score = Math.round((correctCount / totalQuestions) * 100);

      // Update the test score
      await db.test.update({
        where: { id: testId },
        data: { score },
      });
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error saving answer:', error);
    return NextResponse.json(
      { error: 'Failed to save answer' },
      { status: 500 }
    );
  }
} 
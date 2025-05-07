export const dynamic = "force-dynamic";

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

    // Get all of the user's tests, regardless of completion status or type
    const userTests = await db.test.findMany({
      where: {
        userId: dbUser.id,
        // Include all tests - regular and custom review
      },
      select: {
        id: true
      }
    });

    const testIds = userTests.map(test => test.id);

    if (testIds.length === 0) {
      return NextResponse.json({ weakAreas: [] });
    }

    // Find all incorrect answers across all tests
    const incorrectAnswers = await db.testAnswer.findMany({
      where: {
        testId: {
          in: testIds
        },
        isCorrect: false,
        // Only include answers that have actually been answered
        selectedAnswer: {
          not: null
        }
      },
      include: {
        question: true
      }
    });

    // Group by question and count occurrences
    const questionCounts = new Map();

    for (const answer of incorrectAnswers) {
      if (!answer.question) continue;

      const questionId = answer.questionId;
      if (!questionCounts.has(questionId)) {
        questionCounts.set(questionId, {
          count: 0,
          question: answer.question
        });
      }

      questionCounts.get(questionId).count++;
    }

    // Convert to array and sort by frequency (most frequent first)
    const weakAreas = Array.from(questionCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) // Limit to top 5 weak areas
      .map(item => ({
        question: {
          id: item.question.id,
          title: item.question.title,
          correctAnswer: item.question.correctAnswer,
          explanation: item.question.explanation
        },
        incorrectCount: item.count
      }));

    return NextResponse.json({ weakAreas });
  } catch (error) {
    console.error('Error fetching weak areas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weak areas' },
      { status: 500 }
    );
  }
} 
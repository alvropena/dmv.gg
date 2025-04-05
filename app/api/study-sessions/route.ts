import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { Question } from '@/types';

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

    // Get all questions to prepare for the session
    const questions = await db.question.findMany();

    // Create a new study session
    const session = await db.studySession.create({
      data: {
        userId: dbUser.id,
        totalQuestions: questions.length,
        status: 'in_progress',
      },
    });

    // Create initial session answers for each question (unanswered)
    await Promise.all(
      questions.map((question: Question) =>
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
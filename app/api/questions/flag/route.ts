import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { questionId, reason } = body;

    if (!questionId) {
      return NextResponse.json(
        { message: 'Question ID is required' },
        { status: 400 }
      );
    }

    if (!reason) {
      return NextResponse.json(
        { message: 'Reason is required' },
        { status: 400 }
      );
    }

    // Find the user by their clerkId
    const user = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the question exists
    const question = await db.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return NextResponse.json(
        { message: 'Question not found' },
        { status: 404 }
      );
    }

    // Check if the user has already flagged this question
    const existingFlag = await db.flaggedQuestion.findFirst({
      where: {
        questionId,
        userId: user.id,
        status: { notIn: ['resolved', 'dismissed'] }
      }
    });

    if (existingFlag) {
      return NextResponse.json(
        { message: 'You have already flagged this question' },
        { status: 400 }
      );
    }

    // Create the flag
    const flaggedQuestion = await db.flaggedQuestion.create({
      data: {
        questionId,
        userId: user.id,
        reason,
        status: 'pending'
      }
    });

    return NextResponse.json(flaggedQuestion);
  } catch (error) {
    console.error('[QUESTION_FLAG]', error);
    return NextResponse.json(
      { message: 'Internal Error' },
      { status: 500 }
    );
  }
} 
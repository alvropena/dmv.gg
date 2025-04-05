import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { sessionId } = params;
    const { questionId, selectedAnswer } = await request.json();
    
    if (!questionId || !selectedAnswer) {
      return NextResponse.json(
        { error: 'Question ID and selected answer are required' },
        { status: 400 }
      );
    }
    
    // Check if the session belongs to the user
    const session = await db.studySession.findFirst({
      where: {
        id: sessionId,
        user: {
          clerkId: userId,
        },
      },
    });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found or unauthorized' },
        { status: 404 }
      );
    }
    
    // Get the question to check the correct answer
    const question = await db.question.findUnique({
      where: { id: questionId },
    });
    
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }
    
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    // Update the session answer
    const sessionAnswer = await db.sessionAnswer.update({
      where: {
        sessionId_questionId: {
          sessionId,
          questionId,
        },
      },
      data: {
        selectedAnswer,
        isCorrect,
        answeredAt: new Date(),
      },
    });
    
    // Update the session score if the answer is correct
    if (isCorrect) {
      await db.studySession.update({
        where: { id: sessionId },
        data: {
          score: {
            increment: 1,
          },
        },
      });
    }
    
    return NextResponse.json({ sessionAnswer, correct: isCorrect });
  } catch (error) {
    console.error('Error updating session answer:', error);
    return NextResponse.json(
      { error: 'Failed to update session answer' },
      { status: 500 }
    );
  }
} 
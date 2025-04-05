import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { sessionId } = params;
    const body = await request.json();
    const { status, completedAt, durationSeconds } = body;
    
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
    
    // Prepare update data
    const updateData: any = { status };
    
    if (completedAt) {
      updateData.completedAt = new Date(completedAt);
    }
    
    if (durationSeconds !== undefined) {
      updateData.durationSeconds = durationSeconds;
    }
    
    // Update the session
    const updatedSession = await db.studySession.update({
      where: { id: sessionId },
      data: updateData,
    });
    
    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = params;

    // Get the user from the database
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the session with answers and questions
    const session = await db.studySession.findUnique({
      where: {
        id: sessionId,
        userId: dbUser.id, // Ensure the session belongs to the user
      },
      include: {
        questions: {
          include: {
            question: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Extract the ordered list of questions from the session
    const orderedQuestions = session.questions.map(sq => sq.question);

    return NextResponse.json({ 
      session,
      questions: orderedQuestions,
    });

  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { sessionId } = params;
    
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
    
    // Delete the session (cascade will delete associated answers)
    await db.studySession.delete({
      where: { id: sessionId },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
} 
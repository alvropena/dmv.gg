import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function PATCH(
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
    const { status, completedAt, durationSeconds } = body;
    
    // Get the user from the database
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if the test belongs to the user
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
    
    // Prepare update data
    const updateData: {
      status: string;
      completedAt?: Date;
      durationSeconds?: number;
    } = { status };
    
    if (completedAt) {
      updateData.completedAt = new Date(completedAt);
    }
    
    if (durationSeconds !== undefined) {
      updateData.durationSeconds = durationSeconds;
    }
    
    // Update the test
    const updatedTest = await db.test.update({
      where: { id: testId },
      data: updateData,
    });
    
    return NextResponse.json({ test: updatedTest });
  } catch (error) {
    console.error('Error updating test:', error);
    return NextResponse.json(
      { error: 'Failed to update test' },
      { status: 500 }
    );
  }
}

export async function GET(
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

    // Get the user from the database
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the test with answers and questions
    const test = await db.test.findUnique({
      where: {
        id: testId,
        userId: dbUser.id, // Ensure the test belongs to the user
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

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Extract the ordered list of questions from the test
    const orderedQuestions = test.questions.map((tq: { question: unknown }) => tq.question);

    return NextResponse.json({ 
      test,
      questions: orderedQuestions,
    });

  } catch (error) {
    console.error('Error fetching test:', error);
    return NextResponse.json({ error: 'Failed to fetch test' }, { status: 500 });
  }
}

export async function DELETE(
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
    
    // Get the user from the database
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if the test belongs to the user
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
    
    // Delete the test (cascade will delete associated answers)
    await db.test.delete({
      where: { id: testId },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting test:', error);
    return NextResponse.json(
      { error: 'Failed to delete test' },
      { status: 500 }
    );
  }
} 
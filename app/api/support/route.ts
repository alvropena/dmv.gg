import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const { message, email } = await request.json();

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get the user from the database if authenticated
    let dbUser = null;
    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkId: userId }
      });
    }

    // Create the support request
    const supportRequest = await db.supportRequest.create({
      data: {
        userId: dbUser?.id, // Will be null for unauthenticated users
        email: email || undefined, // Will be undefined if not provided
        message,
        status: 'open',
      },
    });

    return NextResponse.json({
      success: true,
      supportRequest: {
        id: supportRequest.id,
        createdAt: supportRequest.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating support request:', error);
    return NextResponse.json(
      { error: 'Failed to create support request' },
      { status: 500 }
    );
  }
}

// Get all support requests (admin only)
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user from the database
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        // You would need to add an isAdmin field to the User model
        // or implement another way to check admin status
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Simple admin check - you should implement a proper role-based check
    // For example, check if user.email matches admin email or user has admin role
    const isAdmin = false; // Change this to actual admin check

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get support requests
    const supportRequests = await db.supportRequest.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return NextResponse.json({ supportRequests });
  } catch (error) {
    console.error('Error fetching support requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support requests' },
      { status: 500 }
    );
  }
} 
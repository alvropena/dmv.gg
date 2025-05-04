import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

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
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user from the database
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId },
      select: {
        role: true
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is admin
    if (dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1', 10);
    const limit = Number.parseInt(searchParams.get('limit') || '21', 10);
    const sortField = searchParams.get('sortField') || 'createdAt';
    const sortDirection = searchParams.get('sortDirection') || 'desc';
    const search = searchParams.get('search');

    // Build where clause for search
    const where: Prisma.SupportRequestWhereInput = search ? {
      OR: [
        { message: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
        {
          user: {
            OR: [
              { firstName: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { lastName: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { email: { contains: search, mode: Prisma.QueryMode.insensitive } }
            ]
          }
        }
      ]
    } : {};

    // Get total count for pagination
    const totalCount = await db.supportRequest.count({ where });

    // Get support requests with pagination and sorting
    const supportRequests = await db.supportRequest.findMany({
      where,
      orderBy: {
        [sortField]: sortDirection as 'asc' | 'desc'
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return NextResponse.json({
      supportRequests,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('Error fetching support requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support requests' },
      { status: 500 }
    );
  }
} 
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get('page') || '1')
    const sortField = searchParams.get('sortField') || 'startedAt'
    const sortDirection = searchParams.get('sortDirection') || 'desc'
    const perPage = 21

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user from the database
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        role: true
      }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only allow ADMIN users to view all tests
    if (dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const skip = (page - 1) * perPage

    // Define the orderBy clause based on sortField and sortDirection
    const orderBy: Record<string, 'asc' | 'desc'> = {}
    switch (sortField) {
      case 'score':
        orderBy.score = sortDirection as 'asc' | 'desc'
        break
      case 'status':
        orderBy.status = sortDirection as 'asc' | 'desc'
        break
      case 'type':
        orderBy.type = sortDirection as 'asc' | 'desc'
        break

      default:
        orderBy.startedAt = sortDirection as 'asc' | 'desc'
        break
    }

    // Get all tests with only the fields we need
    const [tests, total] = await Promise.all([
      db.test.findMany({
        select: {
          id: true,
          userId: true,
          type: true,
          startedAt: true,
          completedAt: true,
          score: true,
          totalQuestions: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy,
        skip,
        take: perPage
      }),
      db.test.count()
    ])

    return NextResponse.json({
      tests,
      total,
      totalPages: Math.ceil(total / perPage)
    })
  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    )
  }
} 
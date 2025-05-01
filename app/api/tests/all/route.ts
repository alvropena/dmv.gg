import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = await auth()

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

    // Get all tests with only the fields we need
    const tests = await db.test.findMany({
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
      orderBy: {
        startedAt: 'desc'
      }
    })

    return NextResponse.json(tests)
  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    )
  }
} 
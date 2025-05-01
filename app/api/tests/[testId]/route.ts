import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: { testId: string } }
) {
  try {
    const { userId } = await auth()
    const { type } = await request.json()

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

    // Only allow ADMIN users to update tests
    if (dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update the test
    const updatedTest = await db.test.update({
      where: {
        id: params.testId
      },
      data: {
        type,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedTest)
  } catch (error) {
    console.error('Error updating test:', error)
    return NextResponse.json(
      { error: 'Failed to update test' },
      { status: 500 }
    )
  }
} 
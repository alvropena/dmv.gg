import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get the user's role
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { role: true }
    })

    // Only allow admins to access all tests
    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const tests = await db.test.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        answers: {
          select: {
            isCorrect: true,
            selectedAnswer: true
          }
        }
      },
      orderBy: {
        startedAt: 'desc'
      }
    })

    // Transform the data to include calculated fields
    const transformedTests = tests.map(test => {
      const correctAnswers = test.answers.filter(answer => answer.isCorrect).length
      const completedQuestions = test.answers.filter(answer => answer.selectedAnswer !== null).length
      const score = test.totalQuestions > 0 
        ? Math.round((correctAnswers / test.totalQuestions) * 100) 
        : 0

      return {
        id: test.id,
        userId: test.userId,
        userName: `${test.user.firstName || ''} ${test.user.lastName || ''}`.trim() || 'Anonymous User',
        userEmail: test.user.email || '',
        totalQuestions: test.totalQuestions,
        completedQuestions,
        correctAnswers,
        score,
        status: test.status,
        startedAt: test.startedAt,
        completedAt: test.completedAt
      }
    })

    return NextResponse.json(transformedTests)
  } catch (error) {
    console.error("[TESTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
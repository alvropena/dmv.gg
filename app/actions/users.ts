'use server'

import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

type UserWithTests = Prisma.UserGetPayload<{
  include: {
    tests: {
      select: {
        totalQuestions: true
        status: true
        answers: {
          select: {
            isCorrect: true
          }
        }
      }
    }
  }
}>

export async function getUsers(searchQuery?: string) {
  try {
    const users = await db.user.findMany({
      where: searchQuery ? {
        OR: [
          { firstName: { contains: searchQuery, mode: 'insensitive' } },
          { lastName: { contains: searchQuery, mode: 'insensitive' } },
          { email: { contains: searchQuery, mode: 'insensitive' } }
        ]
      } : undefined,
      include: {
        tests: {
          select: {
            totalQuestions: true,
            status: true,
            answers: {
              where: {
                isCorrect: true
              },
              select: {
                isCorrect: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    }) as UserWithTests[]

    return users.map(user => {
      const allTests = user.tests.length
      const completedTests = user.tests.filter(test => test.status === 'completed')
      const totalCorrectAnswers = completedTests.reduce((sum: number, test) => sum + test.answers.length, 0)
      const totalAnswers = completedTests.reduce((sum: number, test) => sum + (test.totalQuestions || 0), 0)
      const avgScore = totalAnswers > 0 ? Math.round((totalCorrectAnswers / totalAnswers) * 100) : 0
      
      // Calculate if the user passed or failed
      // Need 89.13% (41/46) or higher to pass
      const PASSING_THRESHOLD = 89.13
      const passed = avgScore >= PASSING_THRESHOLD

      return {
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous User',
        email: user.email,
        status: 'active', // You might want to add a status field to your User model
        role: user.role || 'student', // Use the role from the database, fallback to 'student'
        joined: new Date(user.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        tests: allTests,
        avgScore: completedTests.length > 0 ? `${avgScore}%` : '-',
        passed: completedTests.length > 0 ? passed : false
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }
} 
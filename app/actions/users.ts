'use server'

import { db } from '@/lib/db'

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
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        birthday: true,
        createdAt: true,
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
    })

    return users.map(user => {
      const completedTests = user.tests.filter(test => test.status === 'completed')
      const totalTests = completedTests.length
      const totalCorrectAnswers = completedTests.reduce((sum, test) => sum + test.answers.length, 0)
      const totalQuestions = completedTests.reduce((sum, test) => sum + test.totalQuestions, 0)
      const avgScore = totalQuestions > 0 ? Math.round((totalCorrectAnswers / totalQuestions) * 100) : 0

      return {
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous',
        email: user.email,
        role: user.role,
        joined: new Date(user.createdAt).toLocaleDateString(),
        tests: totalTests,
        avgScore: `${avgScore}%`,
        passed: avgScore >= 80,
        birthday: user.birthday
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
} 
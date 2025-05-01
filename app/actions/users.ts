'use server'

import { db } from '@/lib/db'

export async function getUsers(searchQuery?: string, page: number = 1, perPage: number = 21) {
  try {
    const skip = (page - 1) * perPage;
    const [users, total] = await Promise.all([
      db.user.findMany({
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
        },
        skip,
        take: perPage
      }),
      db.user.count({
        where: searchQuery ? {
          OR: [
            { firstName: { contains: searchQuery, mode: 'insensitive' } },
            { lastName: { contains: searchQuery, mode: 'insensitive' } },
            { email: { contains: searchQuery, mode: 'insensitive' } }
          ]
        } : undefined
      })
    ]);

    return {
      users: users.map(user => {
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
      }),
      total,
      totalPages: Math.ceil(total / perPage)
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
} 
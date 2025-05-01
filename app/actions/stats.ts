'use server'

import { db } from '@/lib/db'

export async function getDashboardStats() {
  try {
    const [
      totalUsers,
      activeTests,
      totalTests,
      totalCorrectAnswers,
      totalAnswers,
      supportTickets
    ] = await Promise.all([
      db.user.count(),
      db.test.count({
        where: {
          status: 'in_progress'
        }
      }),
      db.test.count({
        where: {
          status: 'completed'
        }
      }),
      db.testAnswer.count({
        where: {
          isCorrect: true
        }
      }),
      db.testAnswer.count({
        where: {
          selectedAnswer: {
            not: null
          }
        }
      }),
      db.supportRequest.count({
        where: {
          status: 'open'
        }
      })
    ])

    const passRate = totalTests > 0 
      ? Math.round((totalCorrectAnswers / totalAnswers) * 100) 
      : 0

    return {
      totalUsers,
      activeTests,
      passRate,
      supportTickets
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw new Error('Failed to fetch dashboard statistics')
  }
} 
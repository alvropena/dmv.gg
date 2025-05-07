'use server'

import { db } from '@/lib/db'

export async function getUsers(
  searchQuery?: string,
  page = 1,
  perPage = 21,
  sortField = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
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
        include: {
          subscriptions: true,
          tests: {
            include: {
              answers: true,
              questions: true,
            }
          },
          supportRequests: true,
          flaggedQuestions: true,
        },
        orderBy: {
          [sortField]: sortOrder
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
      users,
      total,
      totalPages: Math.ceil(total / perPage)
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
} 
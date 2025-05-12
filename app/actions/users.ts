'use server'

import { db } from '@/lib/db'
import { Prisma } from '@prisma/client';

export async function getUsers(
  searchQuery?: string,
  page = 1,
  perPage = 21,
  sortField = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  try {
    const skip = (page - 1) * perPage;
    const trimmedQuery = searchQuery?.trim();
    let whereClause = undefined;
    if (trimmedQuery) {
      const words = trimmedQuery.split(/\s+/).filter(Boolean);
      whereClause = {
        AND: words.map(word => ({
          OR: [
            { firstName: { contains: word, mode: 'insensitive' } },
            { lastName: { contains: word, mode: 'insensitive' } },
            { email: { contains: word, mode: 'insensitive' } }
          ]
        }))
      } as unknown as Prisma.UserWhereInput;
    }
    const [users, total] = await Promise.all([
      db.user.findMany({
        where: whereClause,
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
        where: whereClause
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
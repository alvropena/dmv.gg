'use server'

import { db } from '@/lib/db'
import { Question } from '@prisma/client'

export async function getQuestions(
  search?: string, 
  page: number = 1, 
  pageSize: number = 20,
  sortField: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{ questions: Question[], hasMore: boolean }> {
  try {
    let whereClause = {}
    
    if (search) {
      whereClause = {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            optionA: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            optionB: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            optionC: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            optionD: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ]
      }
    }

    // Calculate skip value based on page and pageSize
    const skip = (page - 1) * pageSize;
    
    // Create dynamic orderBy object
    const orderBy = {
      [sortField]: sortOrder
    };
    
    // Fetch questions with pagination
    const questions = await db.question.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: pageSize + 1 // Fetch one extra to determine if there are more
    })
    
    // Check if there are more items
    const hasMore = questions.length > pageSize;
    
    // Return only requested pageSize
    return { 
      questions: hasMore ? questions.slice(0, pageSize) : questions,
      hasMore
    }
  } catch (error) {
    console.error('Error fetching questions:', error)
    throw new Error('Failed to fetch questions')
  }
}

export async function addQuestion(data: {
  title: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  explanation: string
}): Promise<Question> {
  try {
    const question = await db.question.create({
      data
    })
    
    return question
  } catch (error) {
    console.error('Error adding question:', error)
    throw new Error('Failed to add question')
  }
}

export async function updateQuestion(data: {
  id: string
  title: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  explanation: string
}): Promise<Question> {
  try {
    const { id, ...updateData } = data
    
    const question = await db.question.update({
      where: { id },
      data: updateData
    })
    
    return question
  } catch (error) {
    console.error('Error updating question:', error)
    throw new Error('Failed to update question')
  }
} 
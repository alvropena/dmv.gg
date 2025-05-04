'use server'

import { db } from '@/lib/db'

export type ActivityType = 'user_registered' | 'test_completed' | 'question_flagged' | 'support_ticket'

export type Activity = {
    id: string
    type: ActivityType
    user?: {
        id: string
        name: string
    }
    test?: {
        id: string
        title: string
        score?: number
    }
    question?: {
        id: string
        content: string
    }
    supportTicket?: {
        id: string
        subject: string
    }
    createdAt: Date
}

export async function getRecentActivities(limit = 10): Promise<Activity[]> {
    try {
        // Get recent user registrations
        const recentUsers = await db.user.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                createdAt: true
            }
        })

        // Get recent test completions
        const recentTests = await db.test.findMany({
            take: limit,
            where: {
                status: 'completed'
            },
            orderBy: {
                completedAt: 'desc'
            },
            select: {
                id: true,
                type: true,
                score: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                },
                completedAt: true
            }
        })

        // Get recent flagged questions
        const recentFlags = await db.flaggedQuestion.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                question: {
                    select: {
                        id: true,
                        title: true,
                        explanation: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                },
                createdAt: true
            }
        })

        // Get recent support tickets
        const recentTickets = await db.supportRequest.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                message: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                },
                createdAt: true
            }
        })

        // Combine and format all activities
        const activities: Activity[] = [
            ...recentUsers.map(user => ({
                id: user.id,
                type: 'user_registered' as const,
                user: {
                    id: user.id,
                    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous'
                },
                createdAt: user.createdAt
            })),
            ...recentTests.map(test => ({
                id: test.id,
                type: 'test_completed' as const,
                user: {
                    id: test.user.id,
                    name: `${test.user.firstName || ''} ${test.user.lastName || ''}`.trim() || 'Anonymous'
                },
                test: {
                    id: test.id,
                    title: test.type,
                    score: test.score
                },
                createdAt: test.completedAt || new Date()
            })),
            ...recentFlags.map(flag => ({
                id: flag.id,
                type: 'question_flagged' as const,
                user: {
                    id: flag.user.id,
                    name: `${flag.user.firstName || ''} ${flag.user.lastName || ''}`.trim() || 'Anonymous'
                },
                question: {
                    id: flag.question.id,
                    content: flag.question.explanation || flag.question.title
                },
                createdAt: flag.createdAt
            })),
            ...recentTickets.map(ticket => ({
                id: ticket.id,
                type: 'support_ticket' as const,
                user: {
                    id: ticket.user?.id || 'unknown',
                    name: ticket.user ? `${ticket.user.firstName || ''} ${ticket.user.lastName || ''}`.trim() || 'Anonymous' : 'Anonymous'
                },
                supportTicket: {
                    id: ticket.id,
                    subject: `${ticket.message.slice(0, 50)}...`
                },
                createdAt: ticket.createdAt
            }))
        ]

        // Sort all activities by date and limit to the requested number
        return activities
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, limit)
    } catch (error) {
        console.error('Error fetching recent activities:', error)
        throw new Error('Failed to fetch recent activities')
    }
} 
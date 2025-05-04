'use server'

import { db } from '@/lib/db'

export type PerformanceMetrics = {
    userEngagement: {
        value: number
        change: number
    }
    contentCompletion: {
        value: number
        change: number
    }
    firstTimePassRate: {
        value: number
        change: number
    }
}

export async function getPerformanceMetrics(timeHorizon = "30d"): Promise<PerformanceMetrics> {
    const now = new Date();
    let startDate = new Date();
    let previousStartDate = new Date();
    let previousEndDate = new Date();

    switch (timeHorizon) {
        case "1d":
            startDate.setHours(0, 0, 0, 0);
            previousStartDate = new Date(startDate);
            previousStartDate.setDate(previousStartDate.getDate() - 1);
            previousEndDate = new Date(startDate);
            break;
        case "yesterday":
            startDate.setDate(now.getDate() - 1);
            startDate.setHours(0, 0, 0, 0);
            previousStartDate = new Date(startDate);
            previousStartDate.setDate(previousStartDate.getDate() - 1);
            previousEndDate = new Date(startDate);
            break;
        case "7d":
            startDate.setDate(now.getDate() - 7);
            previousStartDate.setDate(startDate.getDate() - 7);
            previousEndDate = new Date(startDate);
            break;
        case "30d":
            startDate.setDate(now.getDate() - 30);
            previousStartDate.setDate(startDate.getDate() - 30);
            previousEndDate = new Date(startDate);
            break;
        case "90d":
            startDate.setDate(now.getDate() - 90);
            previousStartDate.setDate(startDate.getDate() - 90);
            previousEndDate = new Date(startDate);
            break;
        case "all":
            startDate = new Date(0);
            previousStartDate = new Date(0);
            previousEndDate = new Date(0);
            break;
        default:
            startDate.setDate(now.getDate() - 30);
            previousStartDate.setDate(startDate.getDate() - 30);
            previousEndDate = new Date(startDate);
    }

    // Current period
    const [recentActiveUsers, completedUsers, firstTimePasses, totalTests, totalUsers] = await Promise.all([
        db.test.groupBy({
            by: ['userId'],
            where: { completedAt: { gte: startDate } }
        }),
        db.test.count({
            where: { completedAt: { gte: startDate }, score: { gte: 80 } }
        }),
        db.test.count({
            where: { completedAt: { gte: startDate }, type: 'NEW', score: { gte: 80 } }
        }),
        db.test.count({
            where: { completedAt: { gte: startDate } }
        }),
        db.user.count()
    ]);

    // Previous period
    const [prevActiveUsers, prevCompletedUsers, prevFirstTimePasses] = await Promise.all([
        db.test.groupBy({
            by: ['userId'],
            where: { completedAt: { gte: previousStartDate, lt: previousEndDate } }
        }),
        db.test.count({
            where: { completedAt: { gte: previousStartDate, lt: previousEndDate }, score: { gte: 80 } }
        }),
        db.test.count({
            where: { completedAt: { gte: previousStartDate, lt: previousEndDate }, type: 'NEW', score: { gte: 80 } }
        })
    ]);

    const safePercent = (num: number, denom: number) => denom > 0 ? Math.round((num / denom) * 100) : 0;
    const safeChange = (curr: number, prev: number) => prev > 0 ? Math.round(((curr - prev) / prev) * 100) : 0;

    return {
        userEngagement: {
            value: safePercent(recentActiveUsers.length, totalUsers),
            change: safeChange(recentActiveUsers.length, prevActiveUsers.length)
        },
        contentCompletion: {
            value: safePercent(completedUsers, totalTests),
            change: safeChange(completedUsers, prevCompletedUsers)
        },
        firstTimePassRate: {
            value: safePercent(firstTimePasses, totalTests),
            change: safeChange(firstTimePasses, prevFirstTimePasses)
        }
    };
} 
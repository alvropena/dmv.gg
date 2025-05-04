'use server'

import { db } from '@/lib/db'

export async function getDashboardStats(timeHorizon = "1d") {
  try {
    const now = new Date();
    let startDate = new Date();
    let previousStartDate = new Date();
    let previousEndDate = new Date();

    // Calculate start date based on time horizon
    switch (timeHorizon) {
      case "1d":
        // Today
        startDate.setHours(0, 0, 0, 0);
        previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - 1);
        previousEndDate = new Date(startDate);
        break;
      case "yesterday":
        // Yesterday
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
        startDate = new Date(0); // Unix epoch
        previousStartDate = new Date(0);
        previousEndDate = new Date(0);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
        previousStartDate.setDate(startDate.getDate() - 30);
        previousEndDate = new Date(startDate);
    }

    // Get current period stats
    const [
      totalUsers,
      activeTests,
      totalCorrectAnswers,
      totalAnswers,
      supportTickets
    ] = await Promise.all([
      db.user.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      db.test.count({
        where: {
          status: 'in_progress',
          createdAt: {
            gte: startDate
          }
        }
      }),
      db.testAnswer.count({
        where: {
          isCorrect: true,
          createdAt: {
            gte: startDate
          }
        }
      }),
      db.testAnswer.count({
        where: {
          selectedAnswer: {
            not: null
          },
          createdAt: {
            gte: startDate
          }
        }
      }),
      db.supportRequest.count({
        where: {
          status: 'open',
          createdAt: {
            gte: startDate
          }
        }
      })
    ]);

    // Get previous period stats for comparison
    const [
      previousTotalUsers,
      previousActiveTests,
      previousTotalCorrectAnswers,
      previousTotalAnswers,
      previousSupportTickets
    ] = await Promise.all([
      db.user.count({
        where: {
          createdAt: {
            gte: previousStartDate,
            lt: previousEndDate
          }
        }
      }),
      db.test.count({
        where: {
          status: 'in_progress',
          createdAt: {
            gte: previousStartDate,
            lt: previousEndDate
          }
        }
      }),
      db.testAnswer.count({
        where: {
          isCorrect: true,
          createdAt: {
            gte: previousStartDate,
            lt: previousEndDate
          }
        }
      }),
      db.testAnswer.count({
        where: {
          selectedAnswer: {
            not: null
          },
          createdAt: {
            gte: previousStartDate,
            lt: previousEndDate
          }
        }
      }),
      db.supportRequest.count({
        where: {
          status: 'open',
          createdAt: {
            gte: previousStartDate,
            lt: previousEndDate
          }
        }
      })
    ]);

    const passRate = totalAnswers > 0
      ? Math.round((totalCorrectAnswers / totalAnswers) * 100)
      : 0;

    const previousPassRate = previousTotalAnswers > 0
      ? Math.round((previousTotalCorrectAnswers / previousTotalAnswers) * 100)
      : 0;

    // Calculate changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return { change: "0%", trend: "neutral" as const };
      const change = ((current - previous) / previous) * 100;
      return {
        change: `${change > 0 ? '+' : ''}${Math.round(change)}%`,
        trend: change > 0 ? "up" as const : change < 0 ? "down" as const : "neutral" as const
      };
    };

    const usersChange = calculateChange(totalUsers, previousTotalUsers);
    const activeTestsChange = calculateChange(activeTests, previousActiveTests);
    const passRateChange = calculateChange(passRate, previousPassRate);
    const supportTicketsChange = calculateChange(supportTickets, previousSupportTickets);

    return {
      totalUsers,
      activeTests,
      passRate,
      supportTickets,
      changes: {
        users: usersChange,
        activeTests: activeTestsChange,
        passRate: passRateChange,
        supportTickets: supportTicketsChange
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
} 
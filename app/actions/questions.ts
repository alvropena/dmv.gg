"use server";

import { db } from "@/lib/db";
import type { Question } from "@prisma/client";

export async function getQuestions(
  search?: string,
  page = 1,
  pageSize = 20,
  sortField = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
): Promise<{
  questions: (Question & {
    totalAnswers: number;
    incorrectAnswers: number;
    successRate: number;
    unresolvedFlags: number;
  })[];
  total: number;
}> {
  try {
    let whereClause = {};

    if (search) {
      whereClause = {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            optionA: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            optionB: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            optionC: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            optionD: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      };
    }

    // Calculate skip value based on page and pageSize
    const skip = (page - 1) * pageSize;

    // Create dynamic orderBy object
    const orderBy = {
      [sortField]: sortOrder,
    };

    // Get total count
    const total = await db.question.count({
      where: whereClause,
    });

    // Fetch questions with pagination
    const questions = await db.question.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: pageSize,
    });

    // Get answer stats from TestAnswer
    const testAnswers = await db.testAnswer.findMany({
      where: {
        questionId: { in: questions.map((q) => q.id) },
      },
      select: {
        questionId: true,
        isCorrect: true,
      },
    });

    // Get pending flags from FlaggedQuestion
    const flagged = await db.flaggedQuestion.findMany({
      where: {
        questionId: { in: questions.map((q) => q.id) },
        status: "pending",
      },
      select: {
        questionId: true,
      },
    });

    // Aggregate stats
    const answerStats: Record<string, { total: number; incorrect: number }> =
      {};
    for (const ans of testAnswers) {
      if (!answerStats[ans.questionId]) {
        answerStats[ans.questionId] = { total: 0, incorrect: 0 };
      }
      answerStats[ans.questionId].total++;
      if (ans.isCorrect === false) answerStats[ans.questionId].incorrect++;
    }

    const pendingFlagCounts: Record<string, number> = {};
    for (const flag of flagged) {
      pendingFlagCounts[flag.questionId] =
        (pendingFlagCounts[flag.questionId] || 0) + 1;
    }

    // Merge into result
    const result = questions.map((q) => {
      const totalAnswers = answerStats[q.id]?.total || 0;
      const incorrectAnswers = answerStats[q.id]?.incorrect || 0;
      const successRate =
        totalAnswers > 0 ? (totalAnswers - incorrectAnswers) / totalAnswers : 0;
      const unresolvedFlags = pendingFlagCounts[q.id] || 0;
      return {
        ...q,
        totalAnswers,
        incorrectAnswers,
        successRate,
        unresolvedFlags,
      };
    });

    return { questions: result, total };
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Failed to fetch questions");
  }
}

export async function addQuestion(data: {
  title: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
}): Promise<Question> {
  try {
    const question = await db.question.create({
      data,
    });

    return question;
  } catch (error) {
    console.error("Error adding question:", error);
    throw new Error("Failed to add question");
  }
}

export async function updateQuestion(data: {
  id: string;
  title: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
}): Promise<Question> {
  try {
    const { id, ...updateData } = data;

    const question = await db.question.update({
      where: { id },
      data: updateData,
    });

    return question;
  } catch (error) {
    console.error("Error updating question:", error);
    throw new Error("Failed to update question");
  }
}

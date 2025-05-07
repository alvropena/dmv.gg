import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get all questions
    const questions = await db.question.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    // Get answer stats from TestAnswer
    const testAnswers = await db.testAnswer.findMany({
      select: {
        questionId: true,
        isCorrect: true,
      },
    });

    // Get pending flags from FlaggedQuestion
    const flagged = await db.flaggedQuestion.findMany({
      where: { status: "pending" },
      select: {
        questionId: true,
      },
    });

    // Aggregate stats
    const answerStats: Record<string, { total: number; incorrect: number }> = {};
    for (const ans of testAnswers) {
      if (!answerStats[ans.questionId]) {
        answerStats[ans.questionId] = { total: 0, incorrect: 0 };
      }
      answerStats[ans.questionId].total++;
      if (ans.isCorrect === false) answerStats[ans.questionId].incorrect++;
    }

    const pendingFlagCounts: Record<string, number> = {};
    for (const flag of flagged) {
      pendingFlagCounts[flag.questionId] = (pendingFlagCounts[flag.questionId] || 0) + 1;
    }

    // Merge into result
    const result = questions.map(q => {
      const totalAnswers = answerStats[q.id]?.total || 0;
      const incorrectAnswers = answerStats[q.id]?.incorrect || 0;
      const pendingFlags = pendingFlagCounts[q.id] || 0;
      return {
        id: q.id,
        title: q.title,
        totalAnswers,
        incorrectAnswers,
        unresolvedFlags: pendingFlags,
      };
    });

    // Calculate high failure count
    const highFailureCount = result.filter(q => q.totalAnswers > 0 && (q.incorrectAnswers / q.totalAnswers) > 0.8).length;

    return NextResponse.json({
      questions: result,
      highFailureCount,
    });
  } catch (error) {
    console.error("Error fetching questions with stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions with stats", details: error },
      { status: 500 }
    );
  }
} 
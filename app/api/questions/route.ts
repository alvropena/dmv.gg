import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { title, optionA, optionB, optionC, optionD, correctAnswer, explanation } =
      await request.json();

    const question = await db.question.create({
      data: {
        title,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer: correctAnswer.toUpperCase(),
        explanation,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question", details: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const questions = await db.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions", details: error },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const reminders = await db.reminder.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ error: 'Error fetching reminders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, dueDate } = body;

    const reminder = await db.reminder.create({
      data: {
        text,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json(reminder);
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json({ error: 'Error creating reminder' }, { status: 500 });
  }
} 
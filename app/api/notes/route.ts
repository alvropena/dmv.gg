import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const notes = await db.note.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching notes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content } = body;
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }
    const note = await db.note.create({
      data: { title, content },
    });
    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json({ error: "Error creating note" }, { status: 500 });
  }
} 
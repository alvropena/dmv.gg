import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { text, completed } = body;

    const reminder = await db.reminder.update({
      where: {
        id: params.id,
      },
      data: {
        ...(text !== undefined && { text }),
        ...(completed !== undefined && { completed }),
      },
    });

    return NextResponse.json(reminder);
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json({ error: 'Error updating reminder' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.reminder.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ error: 'Error deleting reminder' }, { status: 500 });
  }
} 
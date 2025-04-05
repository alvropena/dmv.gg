import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Find the user in our database
        const user = await prisma.user.findFirst({
            where: {
                clerkId: userId,
            },
            select: {
                birthday: true,
            },
        });

        return NextResponse.json({
            hasBirthday: !!user?.birthday,
            birthday: user?.birthday || null,
        });
    } catch (error) {
        console.error("Error fetching user birthday:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { birthday } = await request.json();

        if (!birthday) {
            return NextResponse.json(
                { error: "Birthday is required" },
                { status: 400 }
            );
        }

        // Update the user's birthday
        await prisma.user.updateMany({
            where: {
                clerkId: userId,
            },
            data: {
                birthday: new Date(birthday),
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating user birthday:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
} 
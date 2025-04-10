import { NextResponse } from "next/server";
import { currentUser, auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's personal information
    const user = await currentUser();

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let dbUser = await db.user.findUnique({
        where: {
            clerkId: userId,
        },
        select: {
            id: true,
            clerkId: true,
            email: true,
            firstName: true,
            lastName: true,
            birthday: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            subscriptions: true
        }
    });

    if (!dbUser) {
        dbUser = await db.user.create({
            data: {
                clerkId: userId,
                email: user.emailAddresses[0]?.emailAddress || "",
                firstName: user.firstName || null,
                lastName: user.lastName || null,
                role: "STUDENT", // Set default role
            },
            select: {
                id: true,
                clerkId: true,
                email: true,
                firstName: true,
                lastName: true,
                birthday: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                subscriptions: true
            }
        });
    }

    return NextResponse.json({ user: dbUser });
} 
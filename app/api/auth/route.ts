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
        try {
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

            // Send welcome email ONLY if user creation succeeded
            if (dbUser.email) {
                try {
                    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/welcome`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: dbUser.email,
                            firstName: dbUser.firstName
                        })
                    });
                } catch (error) {
                    console.error('Error sending welcome email:', error);
                    // Continue without failing the request
                }
            }
        } catch (error) {
            console.error('Error creating user:', error);
            return NextResponse.json({ error: "Failed to process sign up" }, { status: 500 });
        }
    }

    return NextResponse.json({ user: dbUser });
}
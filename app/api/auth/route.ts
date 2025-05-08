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

    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
        return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    // First try to find user by clerkId
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
            subscriptions: true,
            gender: true,
            ethnicity: true,
            language: true,
        }
    });

    // If no user found by clerkId, check if user exists with the email
    if (!dbUser) {
        const existingUserByEmail = await db.user.findUnique({
            where: {
                email: userEmail,
            }
        });

        if (existingUserByEmail) {
            // Update existing user with new clerkId
            dbUser = await db.user.update({
                where: {
                    id: existingUserByEmail.id
                },
                data: {
                    clerkId: userId,
                    firstName: user.firstName || existingUserByEmail.firstName,
                    lastName: user.lastName || existingUserByEmail.lastName,
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
                    subscriptions: true,
                    gender: true,
                    ethnicity: true,
                    language: true,
                }
            });
        } else {
            // Create new user only if no existing user found by email or clerkId
            try {
                dbUser = await db.user.create({
                    data: {
                        clerkId: userId,
                        email: userEmail,
                        firstName: user.firstName || null,
                        lastName: user.lastName || null,
                        role: "STUDENT", // Set default role
                        // Email Notifications
                        emailMarketing: true,
                        emailUpdates: true,
                        emailSecurity: true,
                        // Product Notifications
                        testReminders: true,
                        studyTips: true,
                        progressUpdates: true,
                        weakAreasAlerts: true,
                        // Marketing Preferences
                        promotionalEmails: true,
                        newsletter: true,
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
                        subscriptions: true,
                        gender: true,
                        ethnicity: true,
                        language: true,
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
    }

    return NextResponse.json({ user: dbUser });
}
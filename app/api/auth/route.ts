import { NextResponse } from "next/server";
import { currentUser, auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Resend } from 'resend';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

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
                try { // Try sending the email
                    await resend.emails.send({
                        from: 'DMV.gg <support@dmv.gg>', // Replace with your verified domain if possible
                        to: [dbUser.email],
                        subject: 'Welcome to DMV.gg!',
                        // Call the React component function and pass props
                        react: WelcomeEmail({ firstName: dbUser.firstName || 'there' })
                    });
                } catch { // Catch email sending errors
                    // Decide if you want to fail the request or just log the error
                    // For now, we just log it and continue, as user creation was successful
                }
            }
        } catch { // Catch user creation errors
            // Return an error response if user creation failed
            return NextResponse.json({ error: "Failed to process sign up" }, { status: 500 });
        }
    }

    // If we reach here, dbUser exists (either found initially or created successfully)
    return NextResponse.json({ user: dbUser });
}
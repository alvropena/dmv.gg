import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { clerkId: userId },
            select: {
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
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("[NOTIFICATIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const {
            // Email Notifications
            emailMarketing,
            emailUpdates,
            emailSecurity,
            // Product Notifications
            testReminders,
            studyTips,
            progressUpdates,
            weakAreasAlerts,
            // Marketing Preferences
            promotionalEmails,
            newsletter,
        } = body;

        const user = await db.user.update({
            where: { clerkId: userId },
            data: {
                // Email Notifications
                emailMarketing,
                emailUpdates,
                emailSecurity,
                // Product Notifications
                testReminders,
                studyTips,
                progressUpdates,
                weakAreasAlerts,
                // Marketing Preferences
                promotionalEmails,
                newsletter,
            },
            select: {
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
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("[NOTIFICATIONS_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
} 
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { EmailTriggerType } from "@prisma/client";

interface TriggerPayload {
    userId: string;
    email: string;
    triggerType: EmailTriggerType;
    metadata?: Record<string, any>;
}

export async function POST(req: Request) {
    try {
        const { userId, email, triggerType, metadata } = await req.json() as TriggerPayload;

        // Find the campaign for this trigger type
        const campaign = await db.emailCampaign.findFirst({
            where: {
                triggerType,
                status: "active",
            },
        });

        if (!campaign) {
            return NextResponse.json(
                { error: `No active campaign found for trigger type: ${triggerType}` },
                { status: 404 }
            );
        }

        // Additional validation based on trigger type
        if (triggerType === "TEST_INCOMPLETE") {
            const user = await db.user.findUnique({
                where: { id: userId },
                include: {
                    tests: {
                        where: {
                            completedAt: null,
                            startedAt: {
                                lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
                            },
                        },
                    },
                },
            });

            if (!user || user.tests.length === 0) {
                return NextResponse.json(
                    { message: "No incomplete tests found" },
                    { status: 200 }
                );
            }
        }

        // Create a sent email record
        const sentEmail = await db.sentEmail.create({
            data: {
                campaignId: campaign.id,
                recipientEmail: email,
                status: "pending",
            },
        });

        // Send the email
        try {
            await sendEmail({
                to: email,
                subject: campaign.subject,
                html: campaign.content,
            });

            // Update sent email status
            await db.sentEmail.update({
                where: { id: sentEmail.id },
                data: {
                    status: "sent",
                    sentAt: new Date(),
                },
            });

            return NextResponse.json({ success: true });
        } catch (error) {
            // Update sent email status to failed
            await db.sentEmail.update({
                where: { id: sentEmail.id },
                data: {
                    status: "failed",
                    error: error instanceof Error ? error.message : "Unknown error",
                },
            });

            throw error;
        }
    } catch (error) {
        console.error("Error sending triggered email:", error);
        return NextResponse.json(
            { error: "Failed to send triggered email" },
            { status: 500 }
        );
    }
} 
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { UserRole } from '@/types';
import type { SentEmail } from '@prisma/client';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user || user.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { campaignId, recipientEmails } = body;

        if (!campaignId || !recipientEmails || !Array.isArray(recipientEmails)) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const campaign = await db.emailCampaign.findUnique({
            where: { id: campaignId },
        });

        if (!campaign) {
            return NextResponse.json(
                { error: 'Campaign not found' },
                { status: 404 }
            );
        }

        // Create sent email records
        const sentEmails = await Promise.all(
            recipientEmails.map(async (email: string) => {
                try {
                    // Send email using Resend
                    await resend.emails.send({
                        from: 'DMV.gg <noreply@dmv.gg>',
                        to: email,
                        subject: campaign.subject,
                        html: campaign.content,
                    });

                    // Create sent email record
                    return db.sentEmail.create({
                        data: {
                            campaignId,
                            recipientEmail: email,
                            status: 'sent',
                            sentAt: new Date(),
                        },
                    });
                } catch (error) {
                    console.error(`Error sending email to ${email}:`, error);
                    // Create failed email record
                    return db.sentEmail.create({
                        data: {
                            campaignId,
                            recipientEmail: email,
                            status: 'failed',
                            error: error instanceof Error ? error.message : 'Unknown error',
                        },
                    });
                }
            })
        );

        // Update campaign status if all emails were sent
        const allSent = sentEmails.every((email: SentEmail) => email.status === 'sent');
        if (allSent) {
            await db.emailCampaign.update({
                where: { id: campaignId },
                data: {
                    status: 'completed',
                },
            });
        }

        return NextResponse.json({ success: true, sentEmails });
    } catch (error) {
        console.error('Error sending emails:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 
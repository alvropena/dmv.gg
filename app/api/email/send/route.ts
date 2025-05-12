import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { SentEmail, EmailCampaign } from '@prisma/client';
import { validateAdmin } from '@/lib/auth';
import { sendEmail, getRecipients } from '@/lib/email';
import { CampaignStatus, ScheduleType, EmailStatus } from '@prisma/client';

/** Sends emails for a specific campaign to a list of recipients.
 * Can be triggered manually by admin users or automatically via CRON job.
 * Creates sent email records for each recipient and updates campaign status upon completion.
 * Handles both successful and failed email deliveries with appropriate status tracking.
 */
export async function POST(req: Request) {
    try {
        // Check if this is a CRON job request
        const isCronJob = req.headers.get('x-vercel-cron') === '1';

        if (!isCronJob) {
            // For manual requests, validate admin access
            const { error } = await validateAdmin();
            if (error) return error;
        }

        const body = await req.json();
        const { campaignId, individualEmail } = body;

        // For CRON jobs, find scheduled campaigns
        if (isCronJob) {
            const scheduledCampaigns = await db.emailCampaign.findMany({
                where: {
                    status: CampaignStatus.SCHEDULED,
                    scheduleType: ScheduleType.SCHEDULE,
                    scheduledFor: {
                        lte: new Date(), // Campaigns scheduled for now or in the past
                    },
                    active: true,
                },
            });

            // Process each scheduled campaign
            const results = await Promise.all(
                scheduledCampaigns.map(campaign => processCampaign(campaign))
            );

            return NextResponse.json({
                success: true,
                processedCampaigns: results
            });
        }

        // For manual requests, process single campaign
        if (!campaignId) {
            return NextResponse.json(
                { error: 'Missing campaign ID' },
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

        const result = await processCampaign(campaign, individualEmail);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error sending emails:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/** Helper function to process a single campaign */
async function processCampaign(campaign: EmailCampaign, individualEmail?: string) {
    try {
        // Update campaign status to SENDING
        await db.emailCampaign.update({
            where: { id: campaign.id },
            data: { status: CampaignStatus.SENDING },
        });

        // Get recipients based on campaign segment
        const recipientEmails = await getRecipients({
            segment: campaign.recipientSegment,
            ...(individualEmail && { recipientEmails: [individualEmail] })
        });

        if (recipientEmails.length === 0) {
            await db.emailCampaign.update({
                where: { id: campaign.id },
                data: {
                    status: CampaignStatus.FAILED,
                    active: false,
                },
            });
            return {
                campaignId: campaign.id,
                error: 'No recipients found for the specified segment',
            };
        }

        // Create sent email records
        const sentEmails = await Promise.all(
            recipientEmails.map(async (email: string) => {
                try {
                    // Send email using the utility function
                    const result = await sendEmail({
                        to: email,
                        subject: campaign.subject,
                        html: campaign.content,
                    });

                    // Create sent email record
                    return db.sentEmail.create({
                        data: {
                            campaignId: campaign.id,
                            recipientEmail: email,
                            status: EmailStatus.SENT,
                            sentAt: result.sentAt,
                            messageId: result.id,
                            metadata: {
                                from: result.from,
                                to: result.to,
                            },
                        },
                    });
                } catch (error) {
                    console.error(`Error sending email to ${email}:`, error);
                    // Create failed email record
                    return db.sentEmail.create({
                        data: {
                            campaignId: campaign.id,
                            recipientEmail: email,
                            status: EmailStatus.FAILED,
                            error: error instanceof Error ? error.message : 'Unknown error',
                            errorCode: error instanceof Error ? error.name : 'UNKNOWN',
                            errorMessage: error instanceof Error ? error.message : 'Unknown error',
                        },
                    });
                }
            })
        );

        // Update campaign status based on results
        const allSent = sentEmails.every((email: SentEmail) => email.status === EmailStatus.SENT);
        await db.emailCampaign.update({
            where: { id: campaign.id },
            data: {
                status: allSent ? CampaignStatus.COMPLETED : CampaignStatus.FAILED,
                active: !allSent, // Deactivate only if all emails were sent successfully
            },
        });

        return {
            campaignId: campaign.id,
            success: true,
            sentEmails,
        };
    } catch (error) {
        // Update campaign status to FAILED if there's an error
        await db.emailCampaign.update({
            where: { id: campaign.id },
            data: {
                status: CampaignStatus.FAILED,
                active: false,
            },
        });
        throw error;
    }
} 
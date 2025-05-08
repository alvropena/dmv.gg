import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Resend } from 'resend';
import { EmailTriggerType } from '@prisma/client';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
    try {
        // Verify CRON secret to ensure this endpoint is only called by the scheduler
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Find the test completion reminder campaign
        const campaign = await db.emailCampaign.findFirst({
            where: {
                triggerType: EmailTriggerType.TEST_INCOMPLETE,
                status: 'active'
            }
        });

        if (!campaign) {
            return NextResponse.json({ error: 'No active test reminder campaign found' }, { status: 404 });
        }

        // Find tests that were last answered 24 hours ago and are still incomplete
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const incompleteTests = await db.test.findMany({
            where: {
                status: 'in_progress',
                updatedAt: {
                    lte: twentyFourHoursAgo
                }
            },
            include: {
                user: true,
                answers: {
                    orderBy: {
                        answeredAt: 'desc'
                    },
                    take: 1
                }
            }
        });

        // Group tests by user to avoid sending multiple emails
        const userTests = new Map();
        for (const test of incompleteTests) {
            if (!userTests.has(test.userId)) {
                userTests.set(test.userId, {
                    user: test.user,
                    tests: []
                });
            }
            userTests.get(test.userId).tests.push(test);
        }

        // Send reminder emails
        const results = await Promise.all(
            Array.from(userTests.values()).map(async ({ user, tests }) => {
                try {
                    // Send email
                    await resend.emails.send({
                        from: campaign.from,
                        to: user.email,
                        subject: campaign.subject,
                        html: campaign.content.replace(
                            '${user.firstName}',
                            user.firstName || 'there'
                        ).replace(
                            '${tests.length}',
                            tests.length.toString()
                        ).replace(
                            '${testUrl}',
                            `${process.env.NEXT_PUBLIC_APP_URL}/test`
                        )
                    });

                    // Create sent email record
                    await db.sentEmail.create({
                        data: {
                            campaignId: campaign.id,
                            recipientEmail: user.email,
                            status: 'sent',
                            sentAt: new Date()
                        }
                    });

                    return { success: true, userId: user.id };
                } catch (error) {
                    console.error(`Error sending reminder to ${user.email}:`, error);
                    // Create failed email record
                    await db.sentEmail.create({
                        data: {
                            campaignId: campaign.id,
                            recipientEmail: user.email,
                            status: 'failed',
                            error: error instanceof Error ? error.message : 'Unknown error'
                        }
                    });
                    return { success: false, userId: user.id, error };
                }
            })
        );

        return NextResponse.json({
            success: true,
            processed: results.length,
            results
        });
    } catch (error) {
        console.error('Error processing test reminders:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 
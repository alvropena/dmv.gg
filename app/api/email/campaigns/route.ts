import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { CampaignType, EmailTriggerType, RecipientSegment } from '@prisma/client';
import { CampaignStatus } from '@prisma/client';
import { validateAdmin } from '@/lib/auth';

/** Retrieves all email campaigns with sent email counts, accessible only to admin users. */
export async function GET() {
    try {
        const validation = await validateAdmin();
        if (validation.error) return validation.error;

        const campaigns = await db.emailCampaign.findMany({
            include: {
                _count: {
                    select: {
                        sentEmails: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(campaigns);
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/** Creates a new email campaign with validation for required fields and schedule-specific requirements, accessible only to admin users. */
export async function POST(req: Request) {
    try {
        const validation = await validateAdmin();
        if (validation.error) return validation.error;

        const body = await req.json();
        const {
            name,
            description,
            subject,
            content,
            scheduleType,
            triggerType,
            scheduledFor,
            type,
            recipientSegment
        } = body;

        if (!name || !subject || !content || !scheduleType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate schedule type specific requirements
        if (scheduleType === 'TRIGGER' && !triggerType) {
            return NextResponse.json(
                { error: 'Trigger type is required for trigger-based campaigns' },
                { status: 400 }
            );
        }

        if (scheduleType === 'SCHEDULE' && !scheduledFor) {
            return NextResponse.json(
                { error: 'Schedule date is required for scheduled campaigns' },
                { status: 400 }
            );
        }

        const campaign = await db.emailCampaign.create({
            data: {
                name,
                description,
                subject,
                content,
                scheduleType: scheduleType as 'TRIGGER' | 'SCHEDULE',
                triggerType: triggerType as EmailTriggerType | null,
                scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
                type: (type || 'ONE_TIME') as CampaignType,
                recipientSegment: (recipientSegment || 'ALL_USERS') as RecipientSegment,
                status: scheduledFor ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT,
                active: false,
                // from defaults to "noreply@dmv.gg" in schema
            },
        });

        return NextResponse.json(campaign);
    } catch (error) {
        console.error('Error creating campaign:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 
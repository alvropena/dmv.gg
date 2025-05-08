import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { UserRole } from '@/types';
import type { CampaignType, EmailTriggerType, RecipientSegment } from '@prisma/client';

export async function GET() {
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
                status: scheduledFor ? 'scheduled' : 'draft',
                // active defaults to true in schema
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
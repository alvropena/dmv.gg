import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { UserRole } from '@/types';

export async function GET(req: Request) {
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
        const { name, description, subject, content, scheduledFor } = body;

        if (!name || !subject || !content) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const campaign = await db.emailCampaign.create({
            data: {
                name,
                description,
                subject,
                content,
                scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
                status: scheduledFor ? 'scheduled' : 'draft',
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
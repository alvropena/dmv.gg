import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateAdmin } from '@/lib/auth';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const validation = await validateAdmin();
        if (validation.error) return validation.error;

        const campaign = await db.emailCampaign.findUnique({
            where: { id: params.id },
            include: {
                sentEmails: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        if (!campaign) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }

        return NextResponse.json(campaign);
    } catch (error) {
        console.error('Error fetching campaign:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const validation = await validateAdmin();
        if (validation.error) return validation.error;

        const body = await req.json();
        const { name, description, subject, content, status, scheduledFor } = body;

        const campaign = await db.emailCampaign.update({
            where: { id: params.id },
            data: {
                name,
                description,
                subject,
                content,
                status,
                scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
            },
        });

        return NextResponse.json(campaign);
    } catch (error) {
        console.error('Error updating campaign:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const validation = await validateAdmin();
        if (validation.error) return validation.error;

        await db.emailCampaign.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting campaign:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 
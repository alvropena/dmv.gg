import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the user from the database
        const dbUser = await db.user.findUnique({
            where: { clerkId: userId },
            select: {
                role: true
            }
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if user is admin
        if (dbUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { status, resolution, adminNotes } = await request.json();

        // Update the support request
        const updatedTicket = await db.supportRequest.update({
            where: { id: params.id },
            data: {
                status,
                resolution,
                adminNotes,
                resolvedAt: status === 'resolved' ? new Date() : undefined,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        return NextResponse.json({ supportRequest: updatedTicket });
    } catch (error) {
        console.error('Error updating support request:', error);
        return NextResponse.json(
            { error: 'Failed to update support request' },
            { status: 500 }
        );
    }
} 
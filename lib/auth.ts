import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { UserRole } from '@/types';
import { NextResponse } from 'next/server';

export async function validateAdmin() {
    const { userId } = await auth();
    if (!userId) {
        return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    const user = await db.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user || user.role !== UserRole.ADMIN) {
        return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }

    return { user };
} 
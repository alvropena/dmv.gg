import type { Prisma } from '@prisma/client';
import { EmailTriggerType } from '@prisma/client';
import { handleEmailTrigger } from '@/lib/email';
import { db } from '@/lib/db';

// Middleware to handle user-related triggers
export const userTriggers: Prisma.Middleware = async (params, next) => {
    const result = await next(params);

    if (params.model === 'User' && params.action === 'create') {
        await handleEmailTrigger({
            triggerType: EmailTriggerType.USER_SIGNUP,
            userEmail: result.email
        });
    }

    return result;
};

// Middleware to handle subscription-related triggers
export const subscriptionTriggers: Prisma.Middleware = async (params, next) => {
    const result = await next(params);

    if (params.model === 'Subscription' && params.action === 'create') {
        const user = await db.user.findUnique({
            where: { id: result.userId },
            select: { email: true }
        });

        if (user) {
            await handleEmailTrigger({
                triggerType: EmailTriggerType.PURCHASE_COMPLETED,
                userEmail: user.email
            });
        }
    }

    return result;
};


// Function to register all triggers
export function registerTriggers(prisma: typeof db) {
    prisma.$use(userTriggers);
    prisma.$use(subscriptionTriggers);
} 
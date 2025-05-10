import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

// Define the available user fields for email templates
const templateFields = {
    Users: {
        table: 'user',
        fields: {
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            createdAt: true,
            emailMarketing: true,
            studyTips: true,
            testReminders: true,
            weakAreasAlerts: true,
        }
    }
} as const;

type TemplateFields = typeof templateFields;
type TemplateData = {
    [K in keyof TemplateFields]: Prisma.UserGetPayload<{ select: TemplateFields[K]['fields'] }>
};

type TemplateVariablePath = keyof TemplateData | `${keyof TemplateData}.${string}`;

/**
 * Processes template variables in email content
 * Supports user-related variables like {{Users.firstName}}, {{Users.email}}, etc.
 */
export async function processTemplateVariables(content: string, userEmail: string): Promise<string> {
    const variables: Record<string, Prisma.UserGetPayload<{ select: typeof templateFields.Users.fields }>> = {};
    const variableRegex = /{{([^}]+)}}/g;
    const matches = content.match(variableRegex) || [];

    if (matches.length === 0) return content;

    // Get user data if template contains user variables
    if (content.includes('{{Users')) {
        try {
            const user = await db.user.findUnique({
                where: { email: userEmail },
                select: templateFields.Users.fields
            });

            if (user) {
                variables.Users = user;
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    // Replace variables in content
    let processedContent = content;
    for (const match of matches) {
        const variablePath = match.slice(2, -2).trim() as TemplateVariablePath;
        const [mainKey, subKey] = variablePath.split('.');
        const mainData = variables[mainKey];

        if (mainData) {
            const value = subKey
                ? mainData[subKey as keyof typeof mainData]
                : mainData;
            processedContent = processedContent.replace(match, value?.toString() || '');
        }
    }

    return processedContent;
} 
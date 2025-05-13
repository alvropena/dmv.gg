import { Resend } from "resend";
import { db } from "@/lib/db";
import type { RecipientSegment, EmailTriggerType } from "@prisma/client";
import { RecipientSegment as RecipientSegmentEnum, CampaignStatus as CampaignStatusEnum, ScheduleType as ScheduleTypeEnum, EmailStatus as EmailStatusEnum } from "@prisma/client";
import { processTemplateVariables } from "./email/template";

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting configuration
const BATCH_SIZE = 10; // emails per batch
const BATCH_DELAY = 1000; // 1 second delay between batches

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

interface TriggerHandlerParams {
    triggerType: EmailTriggerType;
    userEmail?: string;
}

interface GetRecipientsParams {
    segment: RecipientSegment;
    recipientEmails?: string[];
}

interface EmailResult {
    id: string;
    status: EmailStatusEnum;
    sentAt: Date;
    from: string;
    to: string;
}

/** Sends a batch of emails with rate limiting */
async function sendEmailBatch(emails: { to: string; subject: string; html: string; from?: string }[]): Promise<EmailResult[]> {
    const results: EmailResult[] = [];
    
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
        const batch = emails.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
            batch.map(email => sendEmail(email))
        );
        results.push(...batchResults);
        
        // If this isn't the last batch, wait before sending the next one
        if (i + BATCH_SIZE < emails.length) {
            await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
        }
    }
    
    return results;
}

/** Sends an email using the Resend API */
export async function sendEmail({ to, subject, html, from = "DMV.gg <noreply@dmv.gg>" }: SendEmailParams): Promise<EmailResult> {
    try {
        // Process template variables before sending
        const processedHtml = await processTemplateVariables(html, to);
        const processedSubject = await processTemplateVariables(subject, to);

        const { data, error } = await resend.emails.send({
            from,
            to,
            subject: processedSubject,
            html: processedHtml,
        });

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error("No data returned from email service");
        }

        return {
            id: data.id,
            status: EmailStatusEnum.SENT,
            sentAt: new Date(),
            from,
            to,
        };
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

/** Retrieves a list of recipient emails based on the specified segment */
export async function getRecipients({ segment, recipientEmails }: GetRecipientsParams): Promise<string[]> {
    try {
        switch (segment) {
            case RecipientSegmentEnum.ALL_USERS: {
                const allUsers = await db.user.findMany({
                    where: {
                        emailMarketing: true,
                    },
                    select: {
                        email: true,
                    },
                });
                return allUsers.map(user => user.email);
            }

            case RecipientSegmentEnum.TEST_USERS: {
                const testUsers = await db.user.findMany({
                    where: {
                        emailMarketing: true,
                        role: "TEST",
                    },
                    select: {
                        email: true,
                    },
                });
                return testUsers.map(user => user.email);
            }

            case RecipientSegmentEnum.INDIVIDUAL_USERS: {
                if (!recipientEmails || recipientEmails.length === 0) {
                    throw new Error("Recipient emails are required for INDIVIDUAL_USERS segment");
                }

                // Verify all emails belong to users who have opted in
                const validUsers = await db.user.findMany({
                    where: {
                        email: {
                            in: recipientEmails
                        },
                        emailMarketing: true,
                    },
                    select: {
                        email: true,
                    },
                });

                const validEmails = validUsers.map(user => user.email);
                const invalidEmails = recipientEmails.filter(email => !validEmails.includes(email));

                if (invalidEmails.length > 0) {
                    throw new Error(`The following emails are not valid or have not opted in to email marketing: ${invalidEmails.join(', ')}`);
                }

                return validEmails;
            }

            default:
                throw new Error(`Invalid recipient segment: ${segment}`);
        }
    } catch (error) {
        console.error("Error getting recipients:", error);
        throw error;
    }
}

/** Handles trigger-based email campaigns for various user events */
export async function handleEmailTrigger({ triggerType, userEmail }: TriggerHandlerParams) {
    try {
        // Find active trigger-based campaigns for this event
        const campaigns = await db.emailCampaign.findMany({
            where: {
                scheduleType: ScheduleTypeEnum.TRIGGER,
                triggerType,
                active: true,
                status: CampaignStatusEnum.SCHEDULED,
            },
        });

        if (campaigns.length === 0) {
            return { processed: 0, message: "No active campaigns found for this trigger" };
        }

        const results = await Promise.all(
            campaigns.map(async (campaign) => {
                try {
                    // Update campaign status to SENDING
                    await db.emailCampaign.update({
                        where: { id: campaign.id },
                        data: { status: CampaignStatusEnum.SENDING },
                    });

                    // Get recipient email(s)
                    let recipientEmails: string[];
                    
                    if (campaign.recipientSegment === RecipientSegmentEnum.INDIVIDUAL_USERS) {
                        if (!userEmail) {
                            throw new Error("User email required for individual user segment");
                        }
                        recipientEmails = [userEmail];
                    } else {
                        // For non-individual segments, we'll get all users who have opted in
                        recipientEmails = await getRecipients({
                            segment: campaign.recipientSegment
                        });
                    }

                    if (recipientEmails.length === 0) {
                        throw new Error("No recipients found for the campaign");
                    }

                    // Prepare email data for all recipients
                    const emailData = recipientEmails.map(email => ({
                        to: email,
                        subject: campaign.subject,
                        html: campaign.content,
                        from: campaign.from,
                    }));

                    // Send emails in batches with rate limiting
                    const emailResults = await sendEmailBatch(emailData);

                    // Create sent email records for successful sends
                    const sentEmails = await Promise.all(
                        emailResults.map(async (result) => {
                            try {
                                return await db.sentEmail.create({
                                    data: {
                                        campaignId: campaign.id,
                                        recipientEmail: result.to,
                                        status: result.status,
                                        sentAt: result.sentAt,
                                        messageId: result.id,
                                        metadata: {
                                            from: result.from,
                                            to: result.to,
                                        },
                                    },
                                });
                            } catch (error) {
                                console.error(`Error creating sent email record for ${result.to}:`, error);
                                // Create failed record if we can't create the sent record
                                return await db.sentEmail.create({
                                    data: {
                                        campaignId: campaign.id,
                                        recipientEmail: result.to,
                                        status: EmailStatusEnum.FAILED,
                                        error: error instanceof Error ? error.message : 'Unknown error',
                                        errorCode: error instanceof Error ? error.name : 'UNKNOWN',
                                        errorMessage: error instanceof Error ? error.message : 'Unknown error',
                                    },
                                });
                            }
                        })
                    );

                    // Update campaign status based on results
                    const allSent = sentEmails.every(email => email.status === EmailStatusEnum.SENT);
                    await db.emailCampaign.update({
                        where: { id: campaign.id },
                        data: {
                            status: allSent ? CampaignStatusEnum.COMPLETED : CampaignStatusEnum.FAILED,
                            active: allSent,
                        },
                    });

                    return {
                        campaignId: campaign.id,
                        success: true,
                        emailResults: sentEmails,
                    };
                } catch (error) {
                    console.error(`Error processing campaign ${campaign.id}:`, error);
                    await db.emailCampaign.update({
                        where: { id: campaign.id },
                        data: {
                            status: CampaignStatusEnum.FAILED,
                            active: false,
                        },
                    });
                    return {
                        campaignId: campaign.id,
                        success: false,
                        error: error instanceof Error ? error.message : "Unknown error",
                    };
                }
            })
        );

        return {
            processed: campaigns.length,
            results,
        };
    } catch (error) {
        console.error("Error handling email trigger:", error);
        throw error;
    }
} 
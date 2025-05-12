-- CreateEnum
CREATE TYPE "EmailTriggerType" AS ENUM ('USER_SIGNUP', 'TEST_INCOMPLETE', 'CART_ABANDONED', 'PROFILE_UPDATED', 'PURCHASE_COMPLETED');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('ONE_TIME', 'DRIP', 'REMINDER', 'TRIGGERED', 'RECURRING', 'AB_TEST');

-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('TRIGGER', 'SCHEDULE');

-- CreateEnum
CREATE TYPE "RecipientSegment" AS ENUM ('ALL_USERS', 'NEW_SIGNUPS', 'VIP_USERS', 'INACTIVE_USERS', 'TEST_INCOMPLETE');

-- CreateTable
CREATE TABLE "EmailCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "from" TEXT NOT NULL DEFAULT 'noreply@dmv.gg',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "type" "CampaignType" NOT NULL DEFAULT 'ONE_TIME',
    "scheduleType" "ScheduleType" NOT NULL,
    "triggerType" "EmailTriggerType",
    "scheduledFor" TIMESTAMP(3),
    "recipientSegment" "RecipientSegment" NOT NULL DEFAULT 'ALL_USERS',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "EmailCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SentEmail" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sentAt" TIMESTAMPTZ,
    "deliveredAt" TIMESTAMPTZ,
    "openedAt" TIMESTAMPTZ,
    "clickedAt" TIMESTAMPTZ,
    "error" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "SentEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmailCampaign_status_idx" ON "EmailCampaign"("status");

-- CreateIndex
CREATE INDEX "EmailCampaign_scheduleType_idx" ON "EmailCampaign"("scheduleType");

-- CreateIndex
CREATE INDEX "EmailCampaign_triggerType_idx" ON "EmailCampaign"("triggerType");

-- CreateIndex
CREATE INDEX "EmailCampaign_scheduledFor_idx" ON "EmailCampaign"("scheduledFor");

-- CreateIndex
CREATE INDEX "EmailCampaign_recipientSegment_idx" ON "EmailCampaign"("recipientSegment");

-- CreateIndex
CREATE INDEX "SentEmail_campaignId_idx" ON "SentEmail"("campaignId");

-- CreateIndex
CREATE INDEX "SentEmail_status_idx" ON "SentEmail"("status");

-- CreateIndex
CREATE INDEX "SentEmail_recipientEmail_idx" ON "SentEmail"("recipientEmail");

-- CreateIndex
CREATE INDEX "SentEmail_sentAt_idx" ON "SentEmail"("sentAt");

-- AddForeignKey
ALTER TABLE "SentEmail" ADD CONSTRAINT "SentEmail_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "EmailCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - The `status` column on the `EmailCampaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `SentEmail` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'FAILED', 'BOUNCED', 'COMPLAINED', 'UNSUBSCRIBED');

-- AlterTable
ALTER TABLE "EmailCampaign" ADD COLUMN     "recipientEmails" TEXT[],
DROP COLUMN "status",
ADD COLUMN     "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "SentEmail" DROP COLUMN "status",
ADD COLUMN     "status" "EmailStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "EmailCampaign_status_idx" ON "EmailCampaign"("status");

-- CreateIndex
CREATE INDEX "SentEmail_status_idx" ON "SentEmail"("status");

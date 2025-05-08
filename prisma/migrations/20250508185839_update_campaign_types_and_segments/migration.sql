/*
  Warnings:

  - The values [DRIP,REMINDER,TRIGGERED] on the enum `CampaignType` will be removed. If these variants are still used in the database, this will fail.
  - The values [NEW_SIGNUPS,VIP_USERS,INACTIVE_USERS,TEST_INCOMPLETE] on the enum `RecipientSegment` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CampaignType_new" AS ENUM ('ONE_TIME', 'RECURRING', 'AB_TEST');
ALTER TABLE "EmailCampaign" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "EmailCampaign" ALTER COLUMN "type" TYPE "CampaignType_new" USING ("type"::text::"CampaignType_new");
ALTER TYPE "CampaignType" RENAME TO "CampaignType_old";
ALTER TYPE "CampaignType_new" RENAME TO "CampaignType";
DROP TYPE "CampaignType_old";
ALTER TABLE "EmailCampaign" ALTER COLUMN "type" SET DEFAULT 'ONE_TIME';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RecipientSegment_new" AS ENUM ('ALL_USERS', 'TEST_USERS', 'INDIVIDUAL_USER');
ALTER TABLE "EmailCampaign" ALTER COLUMN "recipientSegment" DROP DEFAULT;
ALTER TABLE "EmailCampaign" ALTER COLUMN "recipientSegment" TYPE "RecipientSegment_new" USING ("recipientSegment"::text::"RecipientSegment_new");
ALTER TYPE "RecipientSegment" RENAME TO "RecipientSegment_old";
ALTER TYPE "RecipientSegment_new" RENAME TO "RecipientSegment";
DROP TYPE "RecipientSegment_old";
ALTER TABLE "EmailCampaign" ALTER COLUMN "recipientSegment" SET DEFAULT 'ALL_USERS';
COMMIT;

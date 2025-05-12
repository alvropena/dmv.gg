/*
  Warnings:

  - The values [CART_ABANDONED,PROFILE_UPDATED] on the enum `EmailTriggerType` will be removed. If these variants are still used in the database, this will fail.
  - The values [INDIVIDUAL_USER] on the enum `RecipientSegment` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EmailTriggerType_new" AS ENUM ('USER_SIGNUP', 'TEST_INCOMPLETE', 'PURCHASE_COMPLETED');
ALTER TABLE "EmailCampaign" ALTER COLUMN "triggerType" TYPE "EmailTriggerType_new" USING ("triggerType"::text::"EmailTriggerType_new");
ALTER TYPE "EmailTriggerType" RENAME TO "EmailTriggerType_old";
ALTER TYPE "EmailTriggerType_new" RENAME TO "EmailTriggerType";
DROP TYPE "EmailTriggerType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RecipientSegment_new" AS ENUM ('ALL_USERS', 'TEST_USERS', 'INDIVIDUAL_USERS');
ALTER TABLE "EmailCampaign" ALTER COLUMN "recipientSegment" DROP DEFAULT;
ALTER TABLE "EmailCampaign" ALTER COLUMN "recipientSegment" TYPE "RecipientSegment_new" USING ("recipientSegment"::text::"RecipientSegment_new");
ALTER TYPE "RecipientSegment" RENAME TO "RecipientSegment_old";
ALTER TYPE "RecipientSegment_new" RENAME TO "RecipientSegment";
DROP TYPE "RecipientSegment_old";
ALTER TABLE "EmailCampaign" ALTER COLUMN "recipientSegment" SET DEFAULT 'ALL_USERS';
COMMIT;

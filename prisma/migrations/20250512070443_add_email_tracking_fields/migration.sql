-- AlterTable
ALTER TABLE "SentEmail" ADD COLUMN     "errorCode" TEXT,
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "messageId" TEXT,
ADD COLUMN     "metadata" JSONB;

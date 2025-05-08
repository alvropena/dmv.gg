-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailMarketing" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailSecurity" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailUpdates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "newsletter" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "progressUpdates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "promotionalEmails" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "studyTips" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "testReminders" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "weakAreasAlerts" BOOLEAN NOT NULL DEFAULT true;

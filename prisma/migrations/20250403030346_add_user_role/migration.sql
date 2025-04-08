-- Create UserRole enum type
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'ADMIN');

-- Add role column to User table with default value
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'STUDENT'; 
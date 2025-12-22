/*
  Warnings:

  - Added the required column `updatedAt` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProfileAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileAnswer" DROP CONSTRAINT "ProfileAnswer_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "Avatar" ADD COLUMN     "bestUsedWhen" TEXT,
ADD COLUMN     "engagedWhen" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "personalityDescription" TEXT,
ADD COLUMN     "photoKey" TEXT,
ADD COLUMN     "physicalDescription" TEXT,
ADD COLUMN     "profileBlurb" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "voiceDescription" TEXT;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "meta" JSONB;

-- AlterTable
ALTER TABLE "ProfileAnswer" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "context" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Avatar_name_idx" ON "Avatar"("name");

-- CreateIndex
CREATE INDEX "Avatar_archetype_idx" ON "Avatar"("archetype");

-- CreateIndex
CREATE INDEX "Message_sessionId_idx" ON "Message"("sessionId");

-- CreateIndex
CREATE INDEX "Message_role_idx" ON "Message"("role");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");

-- CreateIndex
CREATE INDEX "ProfileAnswer_userId_idx" ON "ProfileAnswer"("userId");

-- CreateIndex
CREATE INDEX "ProfileAnswer_key_idx" ON "ProfileAnswer"("key");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_avatarId_idx" ON "Session"("avatarId");

-- CreateIndex
CREATE INDEX "Session_status_idx" ON "Session"("status");

-- AddForeignKey
ALTER TABLE "ProfileAnswer" ADD CONSTRAINT "ProfileAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

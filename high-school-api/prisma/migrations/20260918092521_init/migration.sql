/*
  Warnings:

  - The `options` column on the `QuizQuestion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `amenities` column on the `Room` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `teacherNames` column on the `Subject` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[passwordResetTokenHash]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "capacity" INTEGER;

-- AlterTable
ALTER TABLE "Homework" ADD COLUMN     "allowLateSubmissions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "classId" TEXT;

-- AlterTable
ALTER TABLE "HomeworkSubmission" ADD COLUMN     "content" TEXT;

-- AlterTable
ALTER TABLE "Language" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "nativeName" TEXT,
ADD COLUMN     "rtl" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "LeaveRequest" ADD COLUMN     "reviewNote" TEXT;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "classId" TEXT,
ADD COLUMN     "scheduledAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "classId" TEXT;

-- AlterTable
ALTER TABLE "QuizQuestion" DROP COLUMN "options",
ADD COLUMN     "options" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "amenities",
ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "teacherNames",
ADD COLUMN     "teacherNames" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordResetExpiresAt" TIMESTAMP(3),
ADD COLUMN     "passwordResetTokenHash" TEXT;

-- CreateIndex
CREATE INDEX "Announcement_audience_idx" ON "Announcement"("audience");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Class_deletedAt_idx" ON "Class"("deletedAt");

-- CreateIndex
CREATE INDEX "Homework_classId_idx" ON "Homework"("classId");

-- CreateIndex
CREATE INDEX "Homework_dueDate_idx" ON "Homework"("dueDate");

-- CreateIndex
CREATE INDEX "Language_isActive_idx" ON "Language"("isActive");

-- CreateIndex
CREATE INDEX "Lesson_classId_idx" ON "Lesson"("classId");

-- CreateIndex
CREATE INDEX "Lesson_scheduledAt_idx" ON "Lesson"("scheduledAt");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE INDEX "Quiz_classId_idx" ON "Quiz"("classId");

-- CreateIndex
CREATE INDEX "Schedule_room_idx" ON "Schedule"("room");

-- CreateIndex
CREATE INDEX "Subject_deletedAt_idx" ON "Subject"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_passwordResetTokenHash_key" ON "User"("passwordResetTokenHash");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

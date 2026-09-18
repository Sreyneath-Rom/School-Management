-- CreateTable
CREATE TABLE "GradeLevel" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "levelOrder" INTEGER NOT NULL,
    "minPassingScore" INTEGER NOT NULL DEFAULT 50,
    "headCoordinator" TEXT NOT NULL,
    "totalClasses" INTEGER NOT NULL DEFAULT 0,
    "enrolledStudents" INTEGER NOT NULL DEFAULT 0,
    "maxCapacity" INTEGER NOT NULL DEFAULT 0,
    "averageGpa" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GradeLevel_code_key" ON "GradeLevel"("code");

-- CreateIndex
CREATE UNIQUE INDEX "GradeLevel_name_key" ON "GradeLevel"("name");

-- CreateIndex
CREATE INDEX "GradeLevel_levelOrder_idx" ON "GradeLevel"("levelOrder");

-- CreateIndex
CREATE INDEX "GradeLevel_status_idx" ON "GradeLevel"("status");

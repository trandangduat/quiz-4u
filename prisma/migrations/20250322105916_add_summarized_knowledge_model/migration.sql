-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "knowledgeId" TEXT;

-- CreateTable
CREATE TABLE "Knowledge" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT,
    "quizzesId" TEXT[],

    CONSTRAINT "Knowledge_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_knowledgeId_fkey" FOREIGN KEY ("knowledgeId") REFERENCES "Knowledge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Knowledge" ADD CONSTRAINT "Knowledge_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

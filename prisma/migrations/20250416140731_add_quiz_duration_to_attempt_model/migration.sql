/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Attempt` table. All the data in the column will be lost.
  - Added the required column `quizDuration` to the `Attempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attempt" DROP COLUMN "createdAt",
ADD COLUMN     "quizDuration" INTEGER NOT NULL,
ADD COLUMN     "quizStartTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

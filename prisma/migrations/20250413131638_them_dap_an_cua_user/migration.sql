/*
  Warnings:

  - You are about to drop the column `score` on the `Attempt` table. All the data in the column will be lost.
  - Added the required column `correctedAnswers` to the `Attempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userChoices` to the `Attempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attempt" DROP COLUMN "score",
ADD COLUMN     "correctedAnswers" INTEGER NOT NULL,
ADD COLUMN     "userChoices" JSONB NOT NULL;

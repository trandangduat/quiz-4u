/*
  Warnings:

  - Added the required column `content` to the `Knowledge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Knowledge" ADD COLUMN     "content" TEXT NOT NULL;

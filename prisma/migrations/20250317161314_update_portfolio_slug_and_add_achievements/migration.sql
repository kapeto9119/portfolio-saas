/*
  Warnings:

  - A unique constraint covering the columns `[userId,slug]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Portfolio_slug_key";

-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "achievements" TEXT[];

-- CreateIndex
CREATE INDEX "Portfolio_slug_idx" ON "Portfolio"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_userId_slug_key" ON "Portfolio"("userId", "slug");

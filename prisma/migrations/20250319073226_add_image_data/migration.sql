/*
  Warnings:

  - You are about to drop the column `fontFamily` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `primaryColor` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryColor` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `seoDescription` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `seoTitle` on the `Portfolio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "fontFamily",
DROP COLUMN "primaryColor",
DROP COLUMN "secondaryColor",
DROP COLUMN "seoDescription",
DROP COLUMN "seoTitle";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "github" TEXT,
ADD COLUMN     "imageData" BYTEA,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "twitter" TEXT;

-- CreateTable
CREATE TABLE "PortfolioTheme" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "layout" TEXT NOT NULL DEFAULT 'grid',
    "primaryColor" TEXT NOT NULL DEFAULT '#3b82f6',
    "secondaryColor" TEXT NOT NULL DEFAULT '#10b981',
    "fontFamily" TEXT NOT NULL DEFAULT 'Inter',
    "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "backgroundImage" TEXT,
    "customCss" TEXT,

    CONSTRAINT "PortfolioTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER DEFAULT 5,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomSection" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaItem" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactForm" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "fields" JSONB NOT NULL,
    "emailTo" TEXT,
    "webhook" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactFormSubmission" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactFormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalCard" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "company" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "imageUrl" TEXT,
    "qrCode" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DigitalCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "marketingEmails" BOOLEAN NOT NULL DEFAULT false,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioTheme_portfolioId_key" ON "PortfolioTheme"("portfolioId");

-- CreateIndex
CREATE INDEX "PortfolioTheme_portfolioId_idx" ON "PortfolioTheme"("portfolioId");

-- CreateIndex
CREATE INDEX "Testimonial_portfolioId_idx" ON "Testimonial"("portfolioId");

-- CreateIndex
CREATE INDEX "CustomSection_portfolioId_idx" ON "CustomSection"("portfolioId");

-- CreateIndex
CREATE INDEX "MediaItem_portfolioId_idx" ON "MediaItem"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactForm_portfolioId_key" ON "ContactForm"("portfolioId");

-- CreateIndex
CREATE INDEX "ContactForm_portfolioId_idx" ON "ContactForm"("portfolioId");

-- CreateIndex
CREATE INDEX "ContactFormSubmission_formId_idx" ON "ContactFormSubmission"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalCard_portfolioId_key" ON "DigitalCard"("portfolioId");

-- CreateIndex
CREATE INDEX "DigitalCard_portfolioId_idx" ON "DigitalCard"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- AddForeignKey
ALTER TABLE "PortfolioTheme" ADD CONSTRAINT "PortfolioTheme_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomSection" ADD CONSTRAINT "CustomSection_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaItem" ADD CONSTRAINT "MediaItem_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactForm" ADD CONSTRAINT "ContactForm_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactFormSubmission" ADD CONSTRAINT "ContactFormSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "ContactForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalCard" ADD CONSTRAINT "DigitalCard_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "AIRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "promptLength" INTEGER NOT NULL,
    "responseLength" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIRequest_userId_idx" ON "AIRequest"("userId");

-- CreateIndex
CREATE INDEX "AIRequest_createdAt_idx" ON "AIRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "AIRequest" ADD CONSTRAINT "AIRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

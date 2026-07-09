-- CreateTable
CREATE TABLE "BrandReward" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "limit" INTEGER,
    "points" INTEGER NOT NULL DEFAULT 0,
    "expiresInDays" INTEGER,
    "usageTerms" TEXT,
    "issuedCount" INTEGER NOT NULL DEFAULT 0,
    "redeemedCount" INTEGER NOT NULL DEFAULT 0,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandReward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BrandReward_brandId_idx" ON "BrandReward"("brandId");

-- CreateIndex
CREATE INDEX "BrandReward_status_idx" ON "BrandReward"("status");

-- AddForeignKey
ALTER TABLE "BrandReward" ADD CONSTRAINT "BrandReward_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

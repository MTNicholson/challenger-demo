-- AlterTable
ALTER TABLE "BrandChallenge"
  ADD COLUMN "category" TEXT,
  ADD COLUMN "mechanicType" TEXT,
  ADD COLUMN "mechanicParams" JSONB,
  ADD COLUMN "rewardData" JSONB,
  ADD COLUMN "heroImageUrl" TEXT,
  ADD COLUMN "locationIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "scheduledAt" TIMESTAMP(3),
  ADD COLUMN "publishedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "BrandChallenge_brandId_status_idx" ON "BrandChallenge"("brandId", "status");

-- CreateIndex
CREATE INDEX "BrandChallenge_scheduledAt_idx" ON "BrandChallenge"("scheduledAt");

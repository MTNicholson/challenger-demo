ALTER TABLE "BrandChallenge"
  ADD COLUMN IF NOT EXISTS "source" TEXT NOT NULL DEFAULT 'brand',
  ADD COLUMN IF NOT EXISTS "createdByLocationUserId" TEXT;
CREATE INDEX IF NOT EXISTS "BrandChallenge_brandId_source_idx" ON "BrandChallenge"("brandId", "source");

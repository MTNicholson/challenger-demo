ALTER TABLE "BrandReward"
  ADD COLUMN IF NOT EXISTS "locationId" TEXT,
  ADD COLUMN IF NOT EXISTS "createdByLocationUserId" TEXT,
  ADD COLUMN IF NOT EXISTS "source" TEXT NOT NULL DEFAULT 'brand';
CREATE INDEX IF NOT EXISTS "BrandReward_locationId_idx" ON "BrandReward"("locationId");

CREATE TABLE IF NOT EXISTS "LocationChallengeRequest" (
  "id" TEXT NOT NULL,
  "brandId" TEXT NOT NULL,
  "locationId" TEXT NOT NULL,
  "createdByLocationUserId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT,
  "mechanicType" TEXT,
  "mechanicParams" JSONB,
  "rewardData" JSONB,
  "rewardId" TEXT,
  "startsAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'submitted',
  "brandReviewComment" TEXT,
  "reviewedByBrandUserId" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "sourceChallengeId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LocationChallengeRequest_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "LocationChallengeRequest_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "LocationChallengeRequest_brandId_status_idx" ON "LocationChallengeRequest"("brandId", "status");
CREATE INDEX IF NOT EXISTS "LocationChallengeRequest_locationId_status_idx" ON "LocationChallengeRequest"("locationId", "status");

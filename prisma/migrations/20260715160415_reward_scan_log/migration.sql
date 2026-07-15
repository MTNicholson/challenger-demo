-- CreateEnum
CREATE TYPE "RewardScanLogStatus" AS ENUM ('VALIDATED', 'REDEEMED', 'NOT_FOUND', 'EXPIRED', 'ALREADY_REDEEMED', 'WRONG_LOCATION', 'CHALLENGE_NOT_COMPLETED', 'CANCELLED', 'ERROR');

-- CreateTable
CREATE TABLE "RewardScanLog" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "locationUserId" TEXT NOT NULL,
    "userId" TEXT,
    "rewardTokenId" TEXT,
    "challengeId" TEXT,
    "rewardId" TEXT,
    "status" "RewardScanLogStatus" NOT NULL,
    "codeRaw" TEXT,
    "message" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewardScanLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RewardScanLog_locationId_createdAt_idx" ON "RewardScanLog"("locationId", "createdAt");

-- CreateIndex
CREATE INDEX "RewardScanLog_brandId_createdAt_idx" ON "RewardScanLog"("brandId", "createdAt");

-- CreateIndex
CREATE INDEX "RewardScanLog_rewardTokenId_idx" ON "RewardScanLog"("rewardTokenId");

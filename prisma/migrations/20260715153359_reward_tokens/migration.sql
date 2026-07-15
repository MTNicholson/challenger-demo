-- CreateEnum
CREATE TYPE "RewardTokenStatus" AS ENUM ('ACTIVE', 'REDEEMED', 'EXPIRED', 'CANCELLED');

-- AlterTable
ALTER TABLE "LocationChallengeRequest" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "RewardToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "participationId" TEXT NOT NULL,
    "rewardId" TEXT,
    "locationId" TEXT,
    "status" "RewardTokenStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "redeemedAt" TIMESTAMP(3),
    "redeemedByLocationUserId" TEXT,
    "redeemedAtLocationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RewardToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RewardToken_token_key" ON "RewardToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "RewardToken_shortCode_key" ON "RewardToken"("shortCode");

-- CreateIndex
CREATE INDEX "RewardToken_participationId_status_idx" ON "RewardToken"("participationId", "status");

-- CreateIndex
CREATE INDEX "RewardToken_userId_status_idx" ON "RewardToken"("userId", "status");

-- CreateIndex
CREATE INDEX "RewardToken_challengeId_idx" ON "RewardToken"("challengeId");

-- CreateIndex
CREATE INDEX "AdminAction_entityType_entityId_idx" ON "AdminAction"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "UserChallenge_challengeId_status_idx" ON "UserChallenge"("challengeId", "status");

-- CreateIndex
CREATE INDEX "UserChallengeEvent_userId_createdAt_idx" ON "UserChallengeEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "WalletTransaction_userId_createdAt_idx" ON "WalletTransaction"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "RewardToken" ADD CONSTRAINT "RewardToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardToken" ADD CONSTRAINT "RewardToken_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "BrandChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardToken" ADD CONSTRAINT "RewardToken_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "UserChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

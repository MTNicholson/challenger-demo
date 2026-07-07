-- AlterTable
ALTER TABLE "BrandLocation"
ADD COLUMN "fullAddress" TEXT,
ADD COLUMN "lat" DOUBLE PRECISION,
ADD COLUMN "lng" DOUBLE PRECISION,
ADD COLUMN "geoProvider" TEXT,
ADD COLUMN "geoPlaceId" TEXT,
ADD COLUMN "geoRaw" JSONB;

-- CreateIndex
CREATE INDEX "BrandLocation_city_idx" ON "BrandLocation"("city");

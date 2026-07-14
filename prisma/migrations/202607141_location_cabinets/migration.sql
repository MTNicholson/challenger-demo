CREATE TYPE "LocationMode" AS ENUM ('STANDARD', 'EXTENDED', 'FLAGSHIP');
CREATE TYPE "LocationUserRole" AS ENUM ('LOCATION_ADMIN', 'LOCATION_STAFF');
CREATE TYPE "LocationUserStatus" AS ENUM ('ACTIVE', 'DISABLED');

ALTER TABLE "BrandLocation" ADD COLUMN "mode" "LocationMode" NOT NULL DEFAULT 'STANDARD', ADD COLUMN "cabinetEnabled" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE "LocationUser" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "LocationUserRole" NOT NULL DEFAULT 'LOCATION_STAFF',
    "status" "LocationUserStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LocationUser_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LocationUser_email_key" ON "LocationUser"("email");
CREATE INDEX "LocationUser_brandId_idx" ON "LocationUser"("brandId");
CREATE INDEX "LocationUser_locationId_role_idx" ON "LocationUser"("locationId", "role");
ALTER TABLE "LocationUser" ADD CONSTRAINT "LocationUser_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LocationUser" ADD CONSTRAINT "LocationUser_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "BrandLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

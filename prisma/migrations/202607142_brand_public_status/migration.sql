CREATE TYPE "BrandPublicStatus" AS ENUM ('OFFLINE', 'ONLINE');

ALTER TABLE "Brand"
  ADD COLUMN "publicStatus" "BrandPublicStatus" NOT NULL DEFAULT 'OFFLINE';

-- Existing approved demo brands remain visible after this migration. New brands
-- are created with OFFLINE and must be launched from their brand settings.
UPDATE "Brand"
SET "publicStatus" = 'ONLINE'
WHERE "status" = 'approved';

-- Preserve existing accounts as usable while requiring OTP verification for new
-- registrations created after this migration.
CREATE TYPE "UserStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE');

ALTER TABLE "UserAuth"
ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

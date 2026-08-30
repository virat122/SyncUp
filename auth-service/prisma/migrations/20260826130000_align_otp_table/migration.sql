-- The registration flow stores only user-bound OTPs. Align the existing table
-- with the current Prisma model without deleting existing OTP records.
ALTER TABLE "OTP" RENAME COLUMN "code" TO "codeHash";

ALTER TABLE "OTP"
ADD COLUMN "attempts" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "OTP_purpose_idx" ON "OTP"("purpose");

/*
  Warnings:

  - You are about to drop the column `password` on the `UserAuth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `UserAuth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `UserAuth` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE', 'APPLE', 'FACEBOOK');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('WEB', 'ANDROID', 'IOS');

-- CreateEnum
CREATE TYPE "OTPChannel" AS ENUM ('EMAIL', 'SMS');

-- CreateEnum
CREATE TYPE "OTPPurpose" AS ENUM ('REGISTER', 'LOGIN', 'VERIFY_EMAIL', 'VERIFY_PHONE', 'RESET_PASSWORD');

-- AlterTable
ALTER TABLE "UserAuth" DROP COLUMN "password",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "provider" "AuthProvider" NOT NULL DEFAULT 'LOCAL',
ADD COLUMN     "providerUserId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceName" TEXT,
    "deviceType" "DeviceType" NOT NULL,
    "deviceToken" TEXT,
    "os" TEXT,
    "browser" TEXT,
    "appVersion" TEXT,
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OTP" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "channel" "OTPChannel" NOT NULL,
    "purpose" "OTPPurpose" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginAudit" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT,
    "success" BOOLEAN NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Device_userId_idx" ON "Device"("userId");

-- CreateIndex
CREATE INDEX "OTP_userId_idx" ON "OTP"("userId");

-- CreateIndex
CREATE INDEX "OTP_expiresAt_idx" ON "OTP"("expiresAt");

-- CreateIndex
CREATE INDEX "LoginAudit_userId_idx" ON "LoginAudit"("userId");

-- CreateIndex
CREATE INDEX "LoginAudit_createdAt_idx" ON "LoginAudit"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuth_phone_key" ON "UserAuth"("phone");

-- CreateIndex
CREATE INDEX "UserAuth_provider_idx" ON "UserAuth"("provider");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAuth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAuth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OTP" ADD CONSTRAINT "OTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAuth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginAudit" ADD CONSTRAINT "LoginAudit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAuth"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image_generated" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subscription_id" TEXT;

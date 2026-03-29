-- AlterTable: Add document fields to User
ALTER TABLE "User" ADD COLUMN "driverLicense" TEXT;
ALTER TABLE "User" ADD COLUMN "insurance" TEXT;

-- AlterTable: Add category to BlogPost and update author default
ALTER TABLE "BlogPost" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'News & Updates';
ALTER TABLE "BlogPost" ALTER COLUMN "author" SET DEFAULT 'Vidi Vici';

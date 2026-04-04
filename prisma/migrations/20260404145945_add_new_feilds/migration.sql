-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'website';

-- AlterTable
ALTER TABLE "EventBooking" ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'website';

-- AlterTable
ALTER TABLE "VillaBooking" ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'website';

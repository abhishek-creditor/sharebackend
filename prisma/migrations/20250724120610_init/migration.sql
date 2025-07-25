-- AlterTable
ALTER TABLE "users" ADD COLUMN     "timezone" VARCHAR(100) NOT NULL DEFAULT 'America/Los_Angeles';

-- CreateTable
CREATE TABLE "recurrence_exception" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "occurrence_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedBy" TEXT,

    CONSTRAINT "recurrence_exception_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recurrence_exception" ADD CONSTRAINT "recurrence_exception_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

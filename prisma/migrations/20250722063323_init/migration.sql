-- DropForeignKey
ALTER TABLE "event_participant" DROP CONSTRAINT "event_participant_eventId_fkey";

-- AddForeignKey
ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "event" ADD COLUMN     "course_id" TEXT;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

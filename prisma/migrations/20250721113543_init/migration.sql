/*
  Warnings:

  - The primary key for the `course_instructors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `course_instructors` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "course_instructors_course_id_user_id_key";

-- AlterTable
ALTER TABLE "course_instructors" DROP CONSTRAINT "course_instructors_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "course_instructors_pkey" PRIMARY KEY ("course_id", "user_id");

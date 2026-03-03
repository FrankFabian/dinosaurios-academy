/*
  Warnings:

  - You are about to alter the column `email` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(320)`.

*/
-- AlterTable
ALTER TABLE "Guardian" ADD COLUMN     "email" VARCHAR(320);

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "photoPublicId" TEXT,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(320);

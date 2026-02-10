/*
  Warnings:

  - A unique constraint covering the columns `[qrCode]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qrCode` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "qrCode" TEXT NOT NULL,
ADD COLUMN     "qrIssuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Student_qrCode_key" ON "Student"("qrCode");

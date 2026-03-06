-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "qrCode" TEXT NOT NULL,
ADD COLUMN     "qrIssuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Student_qrCode_key" ON "Student"("qrCode");


-- AlterTable
ALTER TABLE "Guardian" ADD COLUMN     "email" VARCHAR(320);

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "photoPublicId" TEXT,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(320);


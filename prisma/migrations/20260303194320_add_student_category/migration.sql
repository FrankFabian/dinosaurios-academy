-- CreateEnum
CREATE TYPE "StudentCategory" AS ENUM ('PRE_MINI', 'MINI', 'U13', 'U15', 'U17', 'U19', 'OPEN');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "category" "StudentCategory" NOT NULL DEFAULT 'OPEN';

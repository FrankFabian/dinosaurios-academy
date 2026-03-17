CREATE TYPE "GroupStatus" AS ENUM ('ACTIVE', 'INACTIVE');

ALTER TABLE "Group"
ADD COLUMN "status" "GroupStatus" NOT NULL DEFAULT 'ACTIVE';

CREATE INDEX "Group_status_idx" ON "Group"("status");

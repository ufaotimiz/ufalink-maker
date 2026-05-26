-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('HEADING', 'PARAGRAPH', 'IMAGE', 'AUDIO', 'VIDEO', 'FILE', 'DOCUMENT', 'EMBED', 'DIVIDER');

-- AlterTable
ALTER TABLE "ClientPage" ADD COLUMN     "bodyFont" TEXT NOT NULL DEFAULT 'Inter',
ADD COLUMN     "headingFont" TEXT NOT NULL DEFAULT 'Inter';

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "clientPageId" TEXT NOT NULL,
    "type" "BlockType" NOT NULL,
    "text" TEXT,
    "url" TEXT,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Block_clientPageId_idx" ON "Block"("clientPageId");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_clientPageId_fkey" FOREIGN KEY ("clientPageId") REFERENCES "ClientPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

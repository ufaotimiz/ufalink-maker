-- CreateEnum
CREATE TYPE "BlockSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'FULL');

-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "size" "BlockSize" NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "ClientPage" ADD COLUMN     "bgColor" TEXT;

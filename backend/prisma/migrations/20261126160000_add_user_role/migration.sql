-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SOCIO');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'SOCIO';

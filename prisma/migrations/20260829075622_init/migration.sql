/*
  Warnings:

  - Added the required column `price` to the `Crops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Crops` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Crops" DROP CONSTRAINT "Crops_userId_fkey";

-- DropIndex
DROP INDEX "Crops_userId_idx";

-- AlterTable
ALTER TABLE "Crops" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "Crops" ADD CONSTRAINT "Crops_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "GoodsCategory" AS ENUM ('SEEDS', 'FERTILIZER', 'PESTICIDE', 'EQUIPMENT', 'IRRIGATION', 'OTHER');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'GOODS_PROVIDER';

-- CreateTable
CREATE TABLE "GoodProviders" (
    "Id" UUID NOT NULL,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Role" "Role" NOT NULL DEFAULT 'GOODS_PROVIDER',
    "CompanyName" TEXT,
    "Phone" TEXT,
    "Location" TEXT,
    "Rating" DECIMAL(65,30),
    "Services" JSONB,
    "CreatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoodProviders_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Goods" (
    "Id" UUID NOT NULL,
    "Name" TEXT NOT NULL,
    "Category" "GoodsCategory" NOT NULL,
    "Price" DECIMAL(65,30),
    "Stock" INTEGER,
    "Unit" TEXT,
    "Description" TEXT,
    "ImageURL" TEXT,
    "GoodProviderID" UUID NOT NULL,
    "CreatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Goods_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoodProviders_Email_key" ON "GoodProviders"("Email");

-- AddForeignKey
ALTER TABLE "Goods" ADD CONSTRAINT "Goods_GoodProviderID_fkey" FOREIGN KEY ("GoodProviderID") REFERENCES "GoodProviders"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SERVICE_PROVIDER');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('FERTILIZER', 'PEST_CONTROL', 'IRRIGATION', 'HARVESTING', 'TRANSPORT', 'OTHER');

-- CreateTable
CREATE TABLE "ServiceProviders" (
    "Id" UUID NOT NULL,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Role" "Role" NOT NULL DEFAULT 'SERVICE_PROVIDER',
    "Services" JSONB,
    "CreatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "Rating" DECIMAL(65,30),

    CONSTRAINT "ServiceProviders_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Services" (
    "id" UUID NOT NULL,
    "Name" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "Prices" DECIMAL(65,30),
    "Type" "ServiceType" NOT NULL,
    "Availablefrom" TIMESTAMP(3),
    "ServiceProviderID" UUID NOT NULL,
    "UpdatedAt" TIMESTAMP(3),
    "ImageURL" TEXT,
    "Availableto" TIMESTAMP(3),

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_ServiceProviderID_fkey" FOREIGN KEY ("ServiceProviderID") REFERENCES "ServiceProviders"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

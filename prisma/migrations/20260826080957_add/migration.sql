-- CreateTable
CREATE TABLE "Crops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Crops_userId_idx" ON "Crops"("userId");

-- AddForeignKey
ALTER TABLE "Crops" ADD CONSTRAINT "Crops_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

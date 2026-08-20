-- CreateTable
CREATE TABLE "refesh_tokens" (
    "id" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "refesh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refesh_tokens_token_key" ON "refesh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "refesh_tokens_user_id_key" ON "refesh_tokens"("user_id");

-- AddForeignKey
ALTER TABLE "refesh_tokens" ADD CONSTRAINT "refesh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

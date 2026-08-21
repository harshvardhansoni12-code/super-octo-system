/*
  Warnings:

  - You are about to drop the `refesh_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "refesh_tokens" DROP CONSTRAINT "refesh_tokens_user_id_fkey";

-- DropTable
DROP TABLE "refesh_tokens";

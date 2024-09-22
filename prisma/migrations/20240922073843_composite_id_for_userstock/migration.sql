/*
  Warnings:

  - The primary key for the `UserStocks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserStocks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserStocks" DROP CONSTRAINT "UserStocks_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "UserStocks_pkey" PRIMARY KEY ("ticker", "userId");

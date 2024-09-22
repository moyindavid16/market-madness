/*
  Warnings:

  - The primary key for the `Market` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Market` table. All the data in the column will be lost.
  - You are about to drop the column `portfolio_value` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `UserStocks` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `UserStocks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ticker]` on the table `Market` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ticker` to the `Market` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticker` to the `Trades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketTicker` to the `UserStocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `UserStocks` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Market_name_key";

-- AlterTable
ALTER TABLE "Market" DROP CONSTRAINT "Market_pkey",
DROP COLUMN "name",
ADD COLUMN     "ticker" TEXT NOT NULL,
ADD CONSTRAINT "Market_pkey" PRIMARY KEY ("ticker");

-- AlterTable
ALTER TABLE "Trades" ADD COLUMN     "ticker" TEXT NOT NULL,
ADD COLUMN     "tradeTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "portfolio_value";

-- AlterTable
ALTER TABLE "UserStocks" DROP COLUMN "name",
DROP COLUMN "price",
ADD COLUMN     "marketTicker" TEXT NOT NULL,
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "PortfolioSnapshot" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "PortfolioSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Market_ticker_key" ON "Market"("ticker");

-- AddForeignKey
ALTER TABLE "PortfolioSnapshot" ADD CONSTRAINT "PortfolioSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStocks" ADD CONSTRAINT "UserStocks_marketTicker_fkey" FOREIGN KEY ("marketTicker") REFERENCES "Market"("ticker") ON DELETE RESTRICT ON UPDATE CASCADE;

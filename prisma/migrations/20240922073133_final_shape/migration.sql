/*
  Warnings:

  - You are about to drop the column `marketTicker` on the `UserStocks` table. All the data in the column will be lost.
  - Made the column `userId` on table `PortfolioSnapshot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Trades` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `ticker` to the `UserStocks` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `UserStocks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PortfolioSnapshot" DROP CONSTRAINT "PortfolioSnapshot_userId_fkey";

-- DropForeignKey
ALTER TABLE "Trades" DROP CONSTRAINT "Trades_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserStocks" DROP CONSTRAINT "UserStocks_marketTicker_fkey";

-- DropForeignKey
ALTER TABLE "UserStocks" DROP CONSTRAINT "UserStocks_userId_fkey";

-- AlterTable
ALTER TABLE "PortfolioSnapshot" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Trades" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserStocks" DROP COLUMN "marketTicker",
ADD COLUMN     "ticker" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PortfolioSnapshot" ADD CONSTRAINT "PortfolioSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStocks" ADD CONSTRAINT "UserStocks_ticker_fkey" FOREIGN KEY ("ticker") REFERENCES "Market"("ticker") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStocks" ADD CONSTRAINT "UserStocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trades" ADD CONSTRAINT "Trades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

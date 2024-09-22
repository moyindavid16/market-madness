-- AlterTable
ALTER TABLE "UserStocks" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "UserStocks" ADD CONSTRAINT "UserStocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

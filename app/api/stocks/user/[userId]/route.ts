import prisma from "@/app/db/prisma";
import { NextResponse } from "next/server";

export async function GET(req:Request, {params}: {params: {userId: string}}) {
  // Do whatever you want
  const {userId} = params;

  try {
    const userStocks = await prisma.userStocks.findMany({
      where: {
        userId,
      },
    });

    const stockNames = userStocks.map(stock => stock.ticker);
    
    const marketData = await prisma.market.findMany({
      where: {
        ticker: {
          in: stockNames,
        },
      },
      orderBy: {
        time: "desc",
      },
      take: stockNames.length-1,
    });
    const stockQuantities: Record<string, number> = {};

    userStocks.forEach(stock => {
      stockQuantities[stock.ticker] = stock.quantity;
    });

    const result = marketData.map(stock => {
      const quantity = stockQuantities[stock.ticker];
      return {
        ticker: stock.ticker,
        stockprice: stock.price,
        owned: quantity,
        position: quantity * stock.price,
      };
    });

    return NextResponse.json({stocks: result}, {status: 200});
  } catch (error) {
    return NextResponse.json({error: error}, {status: 500});
  }
}

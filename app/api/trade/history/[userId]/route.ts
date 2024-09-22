import {NextResponse} from "next/server";
import prisma from "@/app/db/prisma";

export async function GET(req: Request, {params}: {params: {userId: string}}) {
  // Do whatever you want
  const {userId} = params;
  if (!userId) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    const trades = await prisma.trades.findMany({
      where: {
        userId: userId,
      },
      take: 15,
      orderBy: {
        tradeTime: "desc",
      },
    });
    const result = trades.map(trade => {
      return {
        date: trade.tradeTime,
        ticker: trade.ticker,
        quantity: trade.quantity,
        price: trade.price,
      };
    });
    
    return NextResponse.json({data: result}, {status: 200});
  } catch (e) {
    console.log(e);
  }

  return NextResponse.json({message: "Join League successful"}, {status: 200});
}

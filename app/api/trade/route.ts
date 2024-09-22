import {NextResponse} from "next/server";
import prisma from "@/app/db/prisma";

export async function POST(req: Request, {params}: {params: {invite: string}}) {
  // Do whatever you want
  const {userId, quantity, price, trade_value, ticker} = await req.json();

  if (!userId) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    const newTrade = await prisma.trades.create({
      data: {
        quantity,
        price,
        trade_value,
        ticker,
        userId: userId,
      },
    });

    await prisma.userStocks.upsert({
      where: {
        ticker_userId: {
          ticker,
          userId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        ticker,
        userId,
        quantity,
      },
    });

    return NextResponse.json({message: "Trade created", data: newTrade}, {status: 200});
  } catch (e) {
    console.log(e);
  }

  return NextResponse.json({message: "Join League successful"}, {status: 200});
}

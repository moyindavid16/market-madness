import {NextResponse} from "next/server";
import prisma from "@/app/db/prisma";

export async function POST(req: Request, {params}: {params: {invite: string}}) {
  // Do whatever you want
  const {userId, quantity, price, trade_value, ticker} = await req.json();

  if (!userId) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    await prisma.trades.create({
      data: {
        quantity,
        price,
        trade_value,
        ticker,
        userId: userId
      }
    })
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        portfolio_value: {
          increment: trade_value
        }
      }
    })
  } catch (e) {
    console.log(e);
  }

  return NextResponse.json({message: "Join League successful"}, {status: 200});
}

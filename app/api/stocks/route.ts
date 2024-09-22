import prisma from "@/app/db/prisma";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
  // Do whatever you want
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');  
  console.log(symbol);

  const marketData = await prisma.market.findMany({
    where: {
      ticker: symbol ? symbol : ""
    }
  });
  return NextResponse.json({marketData: marketData}, {status: 200});
}
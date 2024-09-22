import prisma from "@/app/db/prisma";
import {NextResponse} from "next/server";

export async function GET({params}: {params: {symbol: string}}) {
  // Do whatever you want
  const marketData = await prisma.market.findMany({
    where: {
      name: params.symbol
    }
  });
  return NextResponse.json({marketData: marketData}, {status: 200});
}
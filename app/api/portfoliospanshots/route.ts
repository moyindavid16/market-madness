import prisma from "@/app/db/prisma";
import { currentUser } from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
  // Do whatever you want
  const user = await currentUser();

  const portfolioData = await prisma.portfolioSnapshot.findMany({
    where: {
      userId: user?.id
    }
  });
  return NextResponse.json({portfolioData: portfolioData}, {status: 200});
}
import {NextResponse} from "next/server";
import prisma from "@/app/db/prisma";

export async function GET(req: Request, {params}: {params: {userId: string}}) {
  // Do whatever you want
  const {userId} = params;

  if (!userId) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    const leagues = await prisma.league.findMany({
      where: {
        Users: {
          every: {
            id: userId,
          },
        },
      },
    });
    
    return NextResponse.json({message: "Got all leagues", data: leagues}, {status: 200});
  } catch (e) {
    console.log(e);
    return NextResponse.json({message: (e as Error).message, data: "leagues"}, {status: 200});
  }
}

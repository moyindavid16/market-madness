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
          some: {
            id: userId,
          },
        },
      },
      include: {
        Users: {
          select: {
            value_snapshots: {
              orderBy: {
                id: "desc",
              },
              take: 1,
              select: {
                value: true,
              },
            },
            name: true
          }
        }
      }
    });
    
    const result = leagues.map((league) => {
      const data = league.Users.map((user) => {
        return {
          name: user.name,
          value: user.value_snapshots && user.value_snapshots[0] && user.value_snapshots[0].value || 0
        }
      })
      return {
        id: league.id,
        code: league.invite_code,
        label: league.name,
        data
      }
    })
    
    return NextResponse.json({message: "Got all leagues", data: result || []}, {status: 200});
  } catch (e) {
    console.log(e);
    return NextResponse.json({message: (e as Error).message, data: "leagues"}, {status: 200});
  }
}

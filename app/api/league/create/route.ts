import {NextResponse} from "next/server";
import prisma from "@/app/db/prisma";
import { generateLeagueInviteCode } from "../../../domains/leagues/generateLeagueInvite";

export async function POST(req: Request) {
  // // Do whatever you want
  const {userId, leagueName} = await req.json();
  if(!userId){
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }
  
  const leagueInviteCode = generateLeagueInviteCode();
  const league = await prisma.league.create({
    data: {
      name: leagueName,
      invite_code: leagueInviteCode,
    }
  });

  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      leagues: {
        connect: {
          id: league.id
        }
      }
    }
  });
  
  
  return NextResponse.json({message: "League creation successful"}, {status: 200});
}
import {NextResponse} from "next/server";
import prisma from "@/app/db/prisma";

export async function POST(req: Request, {params}: {params: {invite: string}}) {
  // Do whatever you want
  const {userId} = await req.json();
  const {invite} = params;

  if (!userId) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        leagues: {
          connect: {
            invite_code: invite,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
  }

  return NextResponse.json({message: "Join League successful"}, {status: 200});
}

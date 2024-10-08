import prisma from "@/app/db/prisma";
import {NextResponse} from "next/server";
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

export async function GET() {
  // Do whatever you want
  const user = await currentUser();
  if (user) {
    const name = user?.fullName || user?.firstName + " " + user?.lastName || user?.username || "unknown user";
    console.log(name)
    const createdUser = await prisma.user.create({
      data: {id: user.id, name},
    });
    console.log(createdUser)
    
    redirect("/");
  }
  return NextResponse.json({message: "Hello World"}, {status: 200});
}

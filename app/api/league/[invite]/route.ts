import {NextResponse} from "next/server";
import {currentUser} from "@clerk/nextjs/server";

export async function GET(req: Request, {params}: {params: {invite: string}}) {
  // Do whatever you want
  const user = await currentUser();
  if(!user){
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  
  
  return NextResponse.json({message: "Hello World"}, {status: 200});
}
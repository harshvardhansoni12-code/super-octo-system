import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import {jwt} from "jsonwebtoken"
export async function POST(request) {
  try {

   const userJwt = request.cookies.get("auth_token");
   const {id} = jwt.verify(userJwt,process.env.SECRET_KEY);

   const user = await prisma.user.findUnique({
    where:{id}
   })
  if(!user){
    return NextResponse.json({
        error: "User not found"
    },{
        status:400
    })
  }

  const tokenRevoked = await prisma.refresh_token.findAndUpdateOne({
    where:{id},revoked :true
  }) 

  if(!tokenRevoked)
{
    return NextResponse.json({
        error:"User logout failed"
    },{status:500})
}

return NextResponse.json({
    message:"User logged out"
},{status:200})

  } catch (error) {
    console.log("Logout Failed", error);
    return NextResponse.json({
        error:"Something went wrong"
    },{
        status:500
    })
  }
}

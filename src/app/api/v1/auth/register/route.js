import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import { jwt} from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { email, passsword, name } = await request.json();

    //no email or apssword check
    if (!email || !passsword) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    //password length check
    if (passsword < 6) {
      return NextResponse.json(
        {
          error: "Password should be atleast 6 characters long",
        },
        { status: 400 },
      );
    }

    //existing user check
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        {
          status: 409,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(passsword, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passsword: hashedPassword,
      },
    });
      const tokenvalue = crypto.randomBytes(40).toString("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); //7days
        const refresh_token = await prisma.refresh_token.create({
          data: {
            token: tokenvalue,
            revoked: false,
            expiresAt,
            user: {
              connect: { id: user.id },
            },
          },
        });
        const jwt_token = await jwt.sign(user.id, process.env.SECRET_KEY);
        const cookieStore = await cookies();
        cookieStore.set("auth_token", jwt_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24, // one day
          path: "/",
        });
        cookieStore.set("refresh_token", refresh_token.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // one week
          path: "/",
        });
    

    const { password, ...userwithoutPassword } = newUser;
    return NextResponse.json(
      {
        message: "User created Succesfully",
        user: userwithoutPassword,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Register Error", error);
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 },
    );
  }
}

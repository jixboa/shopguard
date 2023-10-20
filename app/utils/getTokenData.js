import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verify } from "jsonwebtoken";

export const getTokenData = async () => {
  const cookieStore = cookies();

  const token = await cookieStore.get("token");

  if (!token) {
    return NextResponse.json(
      {
        message: "Not Logged In",
      },
      { status: 401 }
    );
  }
  const tokenString = token.value || ""; // Ensure token is a string
  const secret = process.env.JWT_SECRET_KEY || "";

  try {
    const userData = await verify(tokenString, secret);
    // console.log([userData]);
    return userData;
  } catch (error) {
    throw new Error(error.message);
  }
};

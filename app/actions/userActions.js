"use server";

import User from "../../models/userSchema";
import connectMongo from "../../database/conn";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { cookies } from "next/headers";
import { getTokenData } from "../utils/getTokenData";
import { revalidatePath } from "next/cache";

export async function Login(data) {
  const cookieStore = await cookies();

  const MAX_AGE = 60 * 60 * 20;
  let email = data?.email;
  let password = data?.password;

  const user = await User.findOne({ email });
  if (!user) {
    return { error: "User does not exist" };
  }

  const validPassword = await bcryptjs.compare(password, user.password);
  if (!validPassword) {
    return { error: "Invalid Password" };
  }

  const tokenData = {
    id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
    expiresIn: MAX_AGE,
  });

  const serialized = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });

  const response = {
    message: "Authorized",
  };
  cookieStore.set("token", token, { serialized, maxAge: 60 });
}

export async function GetCurrentUser() {
  const cookieStore = await cookies();

  let token = await cookieStore.get("token");

  if (token) {
    const userData = await getTokenData(token.value);
    revalidatePath("/categories");
    return { userData };
  } else {
    revalidatePath("/categories");
    return { message: "No user found" };
  }
}

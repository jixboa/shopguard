import { NextResponse, NextRequest } from "next/server";
import User from "../../../../models/userSchema";
import connectMongo from "../../../../database/conn";
import { getTokenData } from "../../../utils/getTokenData";

import jwt from "jsonwebtoken";

connectMongo();

export async function GET(request) {
  try {
    const userId = await getTokenData(request);
    const user = await User.findOne({ _id: userId }).select("-password");

    return NextResponse.json({
      message: "User Found",
      data: user,
    });
    console.log(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

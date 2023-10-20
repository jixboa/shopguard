// pages/api/getUserData.js
import { NextResponse } from "next/server";
import { getTokenData } from "../../../utils/getTokenData";

export async function GET() {
  const userData = await getTokenData();
  return NextResponse.json(userData);
}

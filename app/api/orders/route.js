import { NextRequest, NextResponse } from "next/server";
import connectMongo from "../../../database/conn";
import Order from "../../../models/categorySchema";

export async function POST(request) {
  await connectMongo();
  //await initMiddleware(req, res);
  const { name } = await request.json();
  const response = await Category.create({ name });
  return NextResponse.json(response);
}

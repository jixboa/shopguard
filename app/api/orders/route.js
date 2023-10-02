import { NextRequest, NextResponse } from "next/server";
import connectMongo from "../../../database/conn";
import Order from "../../../models/orderSchema";

export async function POST(request) {
  await connectMongo();
  //await initMiddleware(req, res);
  const { name } = await request.json();
  const response = await Order.create({ name });
  return NextResponse.json(response);
}

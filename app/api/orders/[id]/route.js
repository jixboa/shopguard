import Order from "../../../../models/orderSchema";
import { NextResponse } from "next/server";
import connectMongo from "../../../../database/conn";

export async function GET(request, { params }) {
  const { id } = params;
  console.log(id);
  await connectMongo();
  const order = await Order.findOne({ _id: id });
  return NextResponse.json({ order }, { status: 200 });
}

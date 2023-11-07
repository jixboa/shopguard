import Order from "../../../../models/orderSchema";
import { NextResponse } from "next/server";
import connectMongo from "../../../../database/conn";

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongo();
  const order = await Order.findOne({ _id: id });
  return NextResponse.json({ order }, { status: 200 });
}

export async function PUT(request, { params }) {
  const { id } = params;
  const { newStatus: status } = await request.json();
  console.log(status);
  await connectMongo();

  await Order.findByIdAndUpdate(id, { status });
  return NextResponse.json({ message: "Order Updated" }, { status: 200 });
}

import connectMongo from "@/database/conn";
import Product from "@/models/productSchema";
import { containerClasses } from "@mui/material";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { name, description, category, price, picture } = await request.json();
  await connectMongo();
  await Product.create({ name, description, category, price, picture });
  return Response.json({ message: "Product Created" }, { status: 201 });
}

export async function GET() {
  await connectMongo();
  const products = await Product.find();
  return Response.json({ products });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongo();
  await Product.findByIdAndDelete(id);
  return Response.json({ message: "Product deleted" }, { status: 200 });
}

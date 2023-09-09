import { NextResponse } from "next/server";
import connectMongo from "../../../database/conn";
import Category from "../../../models/categorySchema";

connectMongo();

export async function POST(request) {
  const { name } = await request.json();

  const response = await Category.create({ name });
  return NextResponse.json(response);
}

export async function GET(request) {
  const categories = await Category.find();
  return NextResponse.json({ categories });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json("Id not Received");
  }
  await Category.findByIdAndDelete(id);
  return NextResponse.json({ message: "Cat deleted" }, { status: 200 });
}

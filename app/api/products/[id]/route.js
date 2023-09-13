import { NextResponse } from "next/server";
import connectMongo from "../../../../database/conn";
import Product from "../../../../models/productSchema";

connectMongo();

export async function PUT(request, { params }) {
  const { id } = params;
  const {
    newName: name,
    newDescription: description,
    newCategory: category,
    newPrice: price,
    newPicture: picture,
  } = await request.json();
  await Product.findByIdAndUpdate(id, {
    name,
    description,
    category,
    price,
    picture,
  });
  return NextResponse.json(
    { message: "Product updated successfully" },
    { status: 200 }
  );
}

export async function GET(request, { params }) {
  const { id } = params;
  const prod = await Product.findOne({ _id: id });
  return NextResponse.json({ prod }, { status: 200 });
}

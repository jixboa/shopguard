import Category from "../../../../models/categorySchema";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongo();
  const category = await Category.findOne({ _id: id });
  return NextResponse.json({ category }, { status: 200 });
}

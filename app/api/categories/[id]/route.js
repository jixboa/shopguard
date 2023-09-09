import Categories from "@/app/categories/page";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongo();
  const category = await Categories.findOne({ _id: id });
  return NextResponse.json({ category }, { status: 200 });
}

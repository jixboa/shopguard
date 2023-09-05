import connectMongo from "../../../../database/conn";
import Product from "@/models/productSchema";

export async function PUT(request, { params }) {
  const { id } = params;
  const {
    newName: name,
    newDescription: description,
    newCategory: category,
    newPrice: price,
    newPicture: picture,
  } = await request.json();
  await connectMongo();
  await Product.findByIdAndUpdate(id, {
    name,
    description,
    category,
    price,
    picture,
  });
  return Response.json(
    { message: "Product updated successfully" },
    { status: 200 }
  );
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongo();
  const prod = await Product.findOne({ _id: id });
  return Response.json({ prod }, { status: 200 });
}

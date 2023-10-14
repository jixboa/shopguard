import { NextRequest, NextResponse } from "next/server";
import connectMongo from "../../../database/conn";
import Order from "../../../models/orderSchema";
import Product from "../../../models/productSchema";

export async function POST(request) {
  await connectMongo();

  const { name, contact, invoice_number, total_amount, paid, selectedIds } =
    await request.json();

  const productIds = selectedIds.split(",");
  const uniqIds = [...new Set(productIds)];
  const products = await Product.find({ _id: { $in: uniqIds } });

  let product_data = [];
  for (let productId of uniqIds) {
    const quantity = productIds.filter((id) => id === productId).length;
    const product = products.find((p) => p._id.toString() == productId);

    product_data.push({
      name: product.name,
      quantity: quantity,
      unit_amount: product.price,
    });
  }

  const order = await Order.create({
    products: product_data,
    name: name,
    contact: contact,
    invoice_number: invoice_number,
    paid: paid,
    total_amount: total_amount,
  });
  //response = await Order.create({ name });
  return NextResponse.json({ order });
}

export async function GET(request) {
  await connectMongo();
  const orders = await Order.find();
  return NextResponse.json({ orders });
}

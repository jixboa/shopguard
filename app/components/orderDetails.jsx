"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Example from "./shoppingcart";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function OrderDetailsClient({ params }) {
  const router = useRouter();
  const [searchParams] = useSearchParams();

  const id = searchParams[1];

  const getOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        cache: "no-store",
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed loading Order");
      }

      const data = await res.json();
      return data.order; // Return the categories array
    } catch (error) {
      console.log("error Loading Order", error);
    }
  };

  const { data } = useQuery({
    queryKey: ["order"],
    queryFn: getOrder,
  });

  /*   if (singleOrder) {
    const order = singleOrder?.map((order) => ({
      name: order.name,
      id: order._id,
      products: order.products,
      total_amount: order.total_amount,
      date: new Date(order.date), // Convert date to a Date object
    }));
  } */

  return (
    <div className="flex pt-20 items-center justify-center gap-8">
      <div>
        <h1>Order Details</h1>
        <h1>{data?.name}</h1>
        <h1>₵{data?.total_amount}</h1>
      </div>
      <div>
        <ol className="mb-10">
          {data?.products &&
            data?.products.map((product, index) => (
              <li
                className=" bg-slate-400 border border-zinc-300"
                key={product.name}>
                Product Name: {product.name}, Quantity: {product.quantity}, Unit
                Amount: {product.unit_amount}
              </li>
            ))}
        </ol>
      </div>
    </div>
  );
}

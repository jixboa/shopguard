"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Example from "./shoppingcart";

export default function OrderDetailsClient({ params }) {
  const router = useRouter();
  const [searchParams] = useSearchParams();

  const id = searchParams[1];
  console.log(id);

  return (
    <div>
      <h1>Order Details - {id}</h1>
      <Example />
    </div>
  );
}

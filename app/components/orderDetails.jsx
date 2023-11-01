"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function OrderDetailsClient() {
  const router = useRouter();
  const [searchParams] = useSearchParams();

  return (
    <div>
      <h1>Order Details</h1>
    </div>
  );
}

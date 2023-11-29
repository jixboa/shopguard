import Image from "next/image";
import Link from "next/link";
import CheckOutComponent from "../components/checkout";
import getQueryClient from "../utils/getQueryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";

export const runtime = "edge";

const getCart = async () => {
  try {
    const res = await fetch(`${process.env.DOMAIN}/api/carts?id=` + "", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed loading Cart");
    }

    const data = await res.json();
    return data.products; // Return the categories array
  } catch (error) {
    console.log("error Loading Cart", error);
  }
};

export default async function CheckOut() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["cart"], getCart);
  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <Hydrate state={dehydratedState}>
        <div>
          <CheckOutComponent />
        </div>
      </Hydrate>
    </>
  );
}

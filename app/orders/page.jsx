import Order from "../../models/orderSchema";
import OrdersClient from "../components/orders";
import getQueryClient from "../utils/getQueryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";

//export const runtime = "edge";

const getOrders = async () => {
  try {
    const res = await fetch(`${process.env.DOMAIN}/api/orders`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed loading Orders");
    }

    const data = await res.json();
    return data.orders; // Return the categories array
  } catch (error) {
    console.log("error Loading Orders", error);
  }
};

export default async function Orders() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["orders"], getOrders);
  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <Hydrate state={dehydratedState}>
        <div className="mt-20">
          <OrdersClient />
        </div>
      </Hydrate>
    </>
  );
}

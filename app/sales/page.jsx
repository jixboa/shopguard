import SalesClient from "../components/sales";
import getQueryClient from "../utils/getQueryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";

//export const runtime = "edge";

const getProducts = async () => {
  try {
    const res = await fetch(`${process.env.DOMAIN}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed loading Products");
    }
    const data = await res.json();
    //console.log(data.products);
    return data; // Return the categories array
  } catch (error) {
    console.log("error Loading Products", error);
  }
};

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

export default async function Sales() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["products"], getProducts);
  await queryClient.prefetchQuery(["cart"], getCart);
  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <Hydrate state={dehydratedState}>
        <div>
          <SalesClient />
        </div>
      </Hydrate>
    </>
  );
}

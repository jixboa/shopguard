export const runtime = "edge";
import ProductClient from "../components/productsClient";

import { CategoryClient } from "../components/categories";
import getQueryClient from "../utils/getQueryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";

const getProducts = async () => {
  try {
    const res = await fetch(`${process.env.DOMAIN}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed loading products");
    }

    return res.json();
  } catch (error) {
    console.log("error Loading products", error);
  }
};

export default async function Products() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["products"], getProducts);
  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <Hydrate state={dehydratedState}>
        <div>
          <ProductClient />
        </div>
      </Hydrate>
    </>
  );
}

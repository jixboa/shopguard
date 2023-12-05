import { get } from "mongoose";
import { CategoryClient } from "../components/categories";
import getQueryClient from "../utils/getQueryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { GetCategories } from "app/actions/categoryActions";

// export const runtime = "edge";
//export const dynamic = "dynamic-force"

const getCategories = async () => {
  try {
    const res = await fetch(`${process.env.DOMAIN}/api/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed loading Categories");
    }

    const data = await res.json();
    return data.categories; // Return the categories array
  } catch (error) {
    console.log("error Loading Categories", error);
  }
};

export default async function Categories() {
  const data = await GetCategories();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["categories"], GetCategories);
  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      {
        <Hydrate state={dehydratedState}>
          <div>
            <CategoryClient data={data} />
          </div>
        </Hydrate>
      }
    </>
  );
}

import { CategoryClient } from "../components/categories";
import getQueryClient from "../utils/getQueryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";

const getCategories = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/categories", {
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
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["categories"], getCategories);
  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <Hydrate state={dehydratedState}>
        <div>
          <CategoryClient />
        </div>
      </Hydrate>
    </>
  );
}

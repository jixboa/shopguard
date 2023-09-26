"use client";

import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProductItems from "./products";
import { useState } from "react";

//get prods
const getProducts = async () => {
  try {
    const res = await fetch(`/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed loading products");
    }

    const data = await res.json();
    return data.products; //
  } catch (error) {
    console.log("error Loading products", error);
  }
};

export default function SalesClient() {
  const [phrase, setPhrase] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("/api/products").then((res) => res.json()),
  });

  const categoryNames = [...new Set(data.products.map((p) => p.category))];
  // console.log(categoryNames);

  if (isLoading) {
    // Render a loading indicator while data is loading
    return <p>Loading...</p>;
  }

  if (!data || !Array.isArray(data.products)) {
    return <p>No products available.</p>;
  }

  let products;

  if (phrase) {
    products = data.products.filter((p) =>
      p.name.toLowerCase().includes(phrase)
    );
  } else {
    products = data.products;
  }

  return (
    <>
      <div className="p-5 mb-16 mt-16">
        <input
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          type="text"
          placeholder="Search for products.."
          className="bg-gray-100 w-full py-2 px-4 rounded-xl"
        />
        <div>
          {categoryNames.map((categoryName) => (
            <div key={categoryName}>
              {products.find((p) => p.category === categoryName) && (
                <div>
                  <h2 className="text-2xl py-5 capitalize">{categoryName}</h2>
                  <div className="flex -mx-5 overflow-x-scroll snap-x ">
                    {products
                      .filter((p) => p.category === categoryName)
                      .map((productInfo) => (
                        <div className="px-5 snap-start" key={productInfo._id}>
                          <ProductItems {...productInfo} />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="py-4"></div>
        </div>
      </div>
    </>
  );
}

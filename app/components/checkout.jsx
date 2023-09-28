"use client";

import { useContext, useEffect, useState } from "react";
import { ProductsContext } from "../components/ProductsContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function CheckOutComponent() {
  const { selectedProducts } = useContext(ProductsContext);
  const [productInfo, setProductInfo] = useState([]);

  const uniqueIds = [...new Set(selectedProducts)];
  const uniqueIdSet = uniqueIds.join(",");

  const getCart = async () => {
    try {
      const res = await fetch("/api/carts?ids=" + uniqueIdSet, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed loading Cart");
      }
      const data = await res.json();
      setProductInfo(data.products);
      //console.log(productInfo);
      return data.products;
    } catch (error) {
      console.log("error Loading Cart", error);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  // Check if there's an error
  if (isError) {
    // Handle the error here, for example, show an error message or render an empty cart.
    return (
      <div>
        <p>Error loading cart. Please try again later.</p>
      </div>
    );
  }

  // Check if the data is still loading
  if (isLoading) {
    // You can render a loading indicator here
    return (
      <div className="mt-20">
        <p>Loading cart...</p>
      </div>
    );
  }

  // Check if there is no data returned
  /*   if (data.length === 0) {
    // Render an empty cart message
    return (
      <div>
        <p className="mt-20">...Loading</p>
      </div>
    );
  }
 */
  return (
    <div className="mt-20">
      {!data || (data.length < 1 && <div>No products in your cart</div>)}
      {data &&
        data.map((prodInfo) => <div key={prodInfo._id}>{prodInfo.name}</div>)}
    </div>
  );
}

"use client";

import { useContext, useEffect, useState } from "react";
import { ProductsContext } from "../components/ProductsContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

export default function CheckOutComponent() {
  const { selectedProducts, setSelectedProducts } = useContext(ProductsContext);
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
  const moreOfThisProduct = (e, id) => {
    e.preventDefault();
    setSelectedProducts((prev) => [...prev, id]);
    //console.log(id);
  };

  const lessOfThisProduct = (e, id) => {
    e.preventDefault();
    const pos = selectedProducts.indexOf(id);
    if (pos !== -1) {
      const newSelectProducts = selectedProducts.filter(
        (value, index) => index !== pos
      );
      setSelectedProducts(newSelectProducts);
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

  const deliveryPrice = 5;
  let subtotal = 0;

  if (selectedProducts?.length) {
    for (let id of selectedProducts) {
      const product = data.find((p) => p._id === id);
      if (product) {
        const price = product.price;
        subtotal = subtotal + price;
      } else {
        console.log("No Selected Ids");
      }
    }
  }

  const total = subtotal + deliveryPrice;
  return (
    <div className="mt-20 px-80 mb-20">
      {!data || (data.length < 1 && <div>No products in your cart</div>)}
      {data &&
        data.map((prodInfo) => {
          const amount = selectedProducts.filter(
            (id) => id === prodInfo._id
          ).length;
          if (amount === 0) return;
          return (
            <div key={prodInfo._id} className="flex mb-5">
              <div className=" bg-gray-100 p-3 rounded-xl shrink-0">
                <img className="w-24" src={prodInfo.picture} alt=""></img>
              </div>
              <div className="pl-4">
                <h3 className="font-bold text-lg">{prodInfo.name}</h3>
                <p className="text-sm leading-3 text-gray-500">
                  {prodInfo.description}
                </p>
                <div className="flex mt-2 flex-row justify-between">
                  <div className=" ">GH₵ {prodInfo.price}</div>
                  <div>
                    <button
                      onClick={(e) => lessOfThisProduct(e, prodInfo._id)}
                      className="border border-emerald-500 px-2 rounded-lg text-emerald-500">
                      -
                    </button>
                    <span className="p-2">
                      {
                        selectedProducts.filter((id) => id === prodInfo._id)
                          .length
                      }
                    </span>
                    <button
                      onClick={(e) => moreOfThisProduct(e, prodInfo._id)}
                      className="bg-emerald-500 px-2 rounded-lg text-white">
                      +
                    </button>
                  </div>
                  <div>
                    -----: GH₵{" "}
                    {selectedProducts.filter((id) => id === prodInfo._id)
                      .length * prodInfo.price}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      <div className="mt-4">
        <input
          className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
          type="text"
          placeholder="street address"
        />
        <input
          className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
          type="text"
          placeholder="City and Postal code"
        />
        <input
          className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
          type="email"
          placeholder="Email address"
        />
        <input
          className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
          type="text"
          placeholder="Name"
        />
      </div>
      <div className="mt-4">
        <div className="flex my-3">
          <h3 className="grow font-bold text-gray-400">Subtotal:</h3>
          <h3 className="font-bold">GH₵ {subtotal}</h3>
        </div>
        <div className="flex my-3">
          <h3 className="grow font-bold text-gray-400">Delivery:</h3>
          <h3 className="font-bold">GH₵ {deliveryPrice}</h3>
        </div>
        <div className="flex my-3 pt-3 border-t border-dashed border-emerald-500">
          <h3 className="grow font-bold text-gray-400">Total:</h3>
          <h3 className="font-bold">GH₵ {total}</h3>
        </div>
      </div>
      <button className=" border p-5 text-white py-2 w-full bg-emerald-500 rounded-xl font-bold mt-4 shadow-emerald-300 shadow-lg">
        Pay GH₵ {total}
      </button>
    </div>
  );
}

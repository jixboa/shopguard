"use client";

import { useContext, useEffect, useState } from "react";
import { ProductsContext } from "../components/ProductsContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

import axios from "axios";
import { toast } from "react-hot-toast";

export default function CheckOutComponent() {
  const queryClient = useQueryClient();

  const { selectedProducts, setSelectedProducts } = useContext(ProductsContext);
  const [productInfo, setProductInfo] = useState([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const [order, setOrder] = useState({
    name: "",
    contact: "",
    invoice_number: "",
    selectedIds: "",
    total_amount: "",
    paid: "",
  });

  //setOrder({ ...order, selectedIds: selectedProducts.join(",") });

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

  const addOrder = async () => {
    //e.preventDefault();
    try {
      const response = await axios.post(`/api/orders`, order);
      toast.success("Created successfully");
      return response.data;
    } catch (error) {
      console.log("Creating Failed", error.message);
      toast.error(error.message);
    } finally {
    }
  };

  const addMutation = useMutation({
    mutationFn: addOrder,
    onSuccess: async (data) => {
      // Update the cache with the newly added category
      /* await queryClient.setQueriesData("orders", (oldData) => [
        ...oldData,
        data,
      ]); */
    },
  });

  const handleAddOrder = (e) => {
    e.preventDefault();

    const invoiceNumber =
      Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
    //console.log(invoiceNumber);

    setOrder({
      ...order,
      invoice_number: invoiceNumber,
      total_amount: total,
      paid: "paid",
      selectedIds: selectedProducts.join(","),
    });
    addMutation.mutate(order);
  };

  return (
    <div className="mt-20 px-80 mb-20">
      <div className=" flex-col justify-start border-b border-gray-700 py-5 mb-5">
        <h1 className=" font-extrabold text-teal-700 text-xl capitalize">
          Shop name
        </h1>
        <h4 className="    text-gray-800 text-sm">Adum, Kumasi - Ghana</h4>
        <h4 className="   text-gray-800 text-sm">233 542 521 836</h4>
        <h4 className="  text-gray-800 text-sm">2023-09-28 11:23:00</h4>
      </div>
      {!data || (data.length < 1 && <div>No products in your cart</div>)}
      {data &&
        data.map((prodInfo) => {
          const amount = selectedProducts.filter(
            (id) => id === prodInfo._id
          ).length;
          if (amount === 0) return;
          return (
            <div
              key={prodInfo._id}
              className="flex mb-3 w-full justify-items-center">
              {/* <div className=" bg-gray-100 p-3 rounded-xl shrink-0">
                <img className="w-24" src={prodInfo.picture} alt=""></img>
              </div> */}
              <div className="pl-4 w-full">
                <h5 className="font-semibold">{prodInfo.name}</h5>
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
          type="hidden"
          value={selectedProducts.join(",")}
          placeholder="street address"
        />
        {/* <input
          className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
          type="text"
          placeholder="street address"
        />
        <input
          className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
          type="text"
          placeholder="City and Postal code"
        /> */}
        <input
          className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
          type="text"
          value={order.name}
          onChange={(e) =>
            setOrder({
              ...order,
              name: e.target.value,
            })
          }
          placeholder="Name"
        />
        <input
          className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
          type="text"
          value={order.contact}
          onChange={(e) => setOrder({ ...order, contact: e.target.value })}
          placeholder="Contact No."
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
      <button
        onClick={handleAddOrder}
        className=" border p-5 text-white py-2 w-full bg-emerald-500 rounded-xl font-bold mt-4 shadow-emerald-300 shadow-lg">
        Pay GH₵ {total}
      </button>
    </div>
  );
}

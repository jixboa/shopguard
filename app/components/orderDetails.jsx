"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Example from "./shoppingcart";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "app/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function OrderDetailsClient({ params }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const [newStatus, setNewStatus] = useState();

  const id = searchParams[1];

  const getOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        cache: "no-store",
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed loading Order");
      }

      const data = await res.json();
      return data.order; // Return the categories array
    } catch (error) {
      console.log("error Loading Order", error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["order"],
    queryFn: getOrder,
  });

  /*   if (singleOrder) {
    const order = singleOrder?.map((order) => ({
      name: order.name,
      id: order._id,
      products: order.products,
      total_amount: order.total_amount,
      date: new Date(order.date), // Convert date to a Date object
    }));
  } */
  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return date.toLocaleString("en-US", options);
  }

  const updateOrder = async () => {
    try {
      const res = await fetch(`api/orders/${data?._id}`, {
        method: "PUT",
        body: JSON.stringify({ newStatus }),
      });

      if (!res.ok) {
        throw new Error("success upate Order");
      }
    } catch (error) {}
  };

  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });

      /* const previousCategories = queryClient.getQueriesData(["orders"]);
      const newCats = previousCategories[0][1];

      // Assuming your updateCategory function returns the updated category
      queryClient.setQueriesData(
        ["orders"],
        newCats.map((category) =>
          category._id === updatedCat._id ? updatedCat : category
        )
      );
      return { newCats }; */
    },
    onError: (err, category, context) => {
      queryClient.setQueriesData(["orders"]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onSuccess(data, variables, context) {
      //setEditOpen(false);
      router.push("/orders");
      toast.success("Updated successfully");
    },
  });

  const payOrder = (e, data) => {
    e.preventDefault();
    console.log(data);
    setNewStatus("paid");
    updateMutation.mutate(data);
  };
  const returnOrder = (e, data) => {
    e.preventDefault();
    console.log(data);
    setNewStatus("returned");
    updateMutation.mutate(data);
  };
  const cancelOrder = (e, data) => {
    e.preventDefault();
    console.log(data);
    setNewStatus("cancelled");
    updateMutation.mutate(data);
  };

  return (
    <>
      <div className="flex flex-col pt-20 items-center justify-center gap-8">
        <h1 className="font-bold text-lg mb-5 ">Order Details</h1>
        <div className="flex flex-row justify-between gap-8 border-b border-gray-300">
          <div className="flex flex-col p-2 ">
            <h1>Invoice number: #{data?.invoice_number}</h1>
            <h1>Date: {formatDate(data?.date)}</h1>
            <h1>
              Order Status:{" "}
              <span className="font-semibold">{data?.status}</span>
            </h1>
          </div>
          <div className="flex flex-col p-2">
            <h1>Customer: {data?.name}</h1>
            <h1 className="font-semibold sm:text-right ">
              Total: ₵{data?.total_amount}
            </h1>
          </div>
        </div>
        <div>
          <ol className="mb-10 overflow-y-scroll p-4 bg-gray-100 h-72">
            <li className="">
              <div className="p-6 grid  my-3 grid-cols-4 justify-between bg-white mb-2 rounded-md">
                <h1 className="font-semibold px-2">Product name</h1>
                <h1 className="font-semibold text-center">Quantity</h1>
                <h1 className="font-semibold">Unit Price</h1>
                <h1 className="font-semibold">Sub Total</h1>
              </div>
            </li>

            {data?.products &&
              data?.products.map((product, index) => (
                <li key={product.name}>
                  {isLoading ? (
                    <Loading />
                  ) : (
                    <div className="p-2 grid  my-3 grid-cols-4 justify-between bg-white mb-2 rounded-md">
                      <h1 className="font-normal pl-4">{product.name} </h1>
                      <h1 className="font-normal text-center">
                        {product.quantity}
                      </h1>
                      <h1 className="font-normal ">₵{product.unit_amount}</h1>
                      <h1 className="font-normal">
                        ₵{product.quantity * product.unit_amount}
                      </h1>
                    </div>
                  )}
                  {/*    <div className="text-center flex flex-row gap-4 justify-between">
                    <h1 className="font-normal px-2"> {product.name}</h1>
                    <h1 className="font-normal text-center">
                      {product.quantity}
                    </h1>
                    <h1 className="font-normal text-center">
                      ₵{product.unit_amount}
                    </h1>
                    <h1 className="font-normal ">
                      ₵{product.quantity * product.unit_amount}
                    </h1>
                  </div> */}
                </li>
              ))}
          </ol>
        </div>
      </div>
      <div className="flex gap-2 justify-center items-center">
        {data?.status == "pending" && (
          <button
            onClick={(e) => {
              payOrder(e, data);
            }}
            className="p-2 rounded-md bg-teal-400 text-white hover:bg-teal-500 hover:shadow-md hover:shadow-gray-900">
            Pay Order
          </button>
        )}
        {data?.status == "pending" && (
          <button
            onClick={(e) => {
              cancelOrder(e, data);
            }}
            className="p-2 rounded-md bg-teal-400 text-white hover:bg-teal-500 hover:shadow-md hover:shadow-gray-900">
            Cancel Order
          </button>
        )}
        {data?.status == "paid" && (
          <button
            onClick={(e) => {
              returnOrder(e, data);
            }}
            className="p-2 rounded-md bg-teal-400 text-white hover:bg-teal-500 hover:shadow-md hover:shadow-gray-900">
            Return Order
          </button>
        )}

        <button
          onClick={(e) => {
            router.push("/checkout");
          }}
          className="p-2 rounded-md bg-teal-400 text-white hover:bg-teal-500 hover:shadow-md hover:shadow-gray-900">
          Recreate Order
        </button>
      </div>
    </>
  );
}

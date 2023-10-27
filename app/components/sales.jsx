"use client";

import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProductItems from "./products";
import { useState, useEffect, useContext } from "react";
import { ProductsContext } from "../components/ProductsContext";

import { toast } from "react-hot-toast";
import axios from "axios";

import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const queryClient = useQueryClient();
  const { selectedProducts, setSelectedProducts } = useContext(ProductsContext);

  const [cashRecieved, setCashRecieve] = useState(0);
  const [change, setChange] = useState(0);

  const [productInfo, setProductInfo] = useState([]);

  // ###################### checkout ######################

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
      return data.products;
    } catch (error) {
      console.log("error Loading Cart", error);
    }
  };

  useEffect(() => {
    // When selectedProducts change, trigger a page refresh
    getCart();
    router.prefetch("/sales"); // This will refresh the current page
  }, [selectedProducts]);

  const moreOfThisProduct = (e, id) => {
    e.preventDefault();
    setSelectedProducts((prev) => [...prev, id]);
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

  const { data: cartData, isError: cartIsError } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  //console.log(cartData);

  const deliveryPrice = 0;
  let subtotal = 0;

  if (selectedProducts?.length) {
    for (let id of selectedProducts) {
      const product = productInfo.find((p) => p._id === id);
      if (product) {
        const price = parseFloat(product.price, 10);
        subtotal = subtotal + price;
      } else {
        //console.log("No Selected Ids");
      }
    }
  }

  const total = subtotal + deliveryPrice;

  const addOrder = async () => {
    //e.preventDefault();
    try {
      const response = await axios.post(`/api/orders`, order);

      return response.data;
    } catch (error) {
      console.log("Creating Failed", error.message);
      toast.error(error.message);
    } finally {
    }
  };

  const { mutate } = useMutation(addOrder, {
    onMutate: async (data) => {
      await queryClient.cancelQueries(["products"]);
    },
    onError: (error, newCategory, context) => {
      // Handle errors, if needed
      toast.success("Error creating order");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["products"]);
      setSelectedProducts([]);
    },
    onSuccess: (data, variables, context) => {
      // Handle success, if needed
      setOrder({
        name: "",
        contact: "",
        invoice_number: "",
        selectedIds: "",
        total_amount: "",
        paid: "",
      });
      toast.success("Order Created successfully");
    },
  });

  let newChange = 0.0;

  if (cashRecieved > total) {
    newChange = parseFloat(cashRecieved, 0) - parseFloat(total, 10);
  }

  const handleAddOrder = async (e) => {
    e.preventDefault();
    await setChange(newChange);

    const invoiceNumber =
      Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
    //console.log(invoiceNumber);

    await setOrder({
      ...order,
      invoice_number: invoiceNumber,
      total_amount: total,
      paid: "paid",
      selectedIds: selectedProducts.join(","),
    });
    /*    mutate(order); */
  };

  /////////////////// checkout ######################

  const [phrase, setPhrase] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("/api/products").then((res) => res.json()),
  });

  const categoryNames = [...new Set(data.products.map((p) => p.category))];
  // console.log(categoryNames);

  if (isLoading) {
    // Render a loading indicator while data is loading
    return <p className="ml-20 mt-20 text-black font-normal">Loading...</p>;
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
      <div className="p-5 mb-5 mt-5 flex flex-row">
        <div className="w-2/3">
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
                          <div
                            className="px-5 snap-start"
                            key={productInfo._id}>
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

        <div className="w-1/3 px-5 ml-10 bg-gray-50">
          <div className=" flex-col justify-start border-b border-gray-700 py-5 mb-5">
            <h1 className=" font-extrabold text-teal-700 text-xl capitalize">
              Shop name
            </h1>
            <h4 className="    text-gray-800 text-sm">Adum, Kumasi - Ghana</h4>
            <h4 className="   text-gray-800 text-sm">233 542 521 836</h4>
            <h4 className="  text-gray-800 text-sm">2023-09-28 11:23:00</h4>
          </div>
          {!productInfo ||
            (productInfo.length < 1 && <div>No products in your cart</div>)}
          {productInfo &&
            productInfo.map((prodInfo) => {
              const amount = selectedProducts.filter(
                (id) => id === prodInfo._id
              ).length;
              if (amount === 0) return;
              return (
                <div
                  key={prodInfo._id}
                  className="flex mb-3 w-full justify-items-center">
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
              <h3 className="grow font-bold text-gray-400">Other Charges:</h3>
              <h3 className="font-bold">GH₵ {deliveryPrice}</h3>
            </div>

            {selectedProducts.length ? (
              <div className="grid grid-cols-2 md:grid-col-1 sm:grid-col-1  gap-4  border border-b-2 p-1 bg-gray-100 rounded-md">
                <div className="px-2 flex flex-row sm:flex-col xs-flex-col justify-start items-center w-full">
                  <h3 className="text-sm  text-gray-600 font-normal">
                    Cash recieved:
                  </h3>
                  <input
                    type="text"
                    onChange={async (e) => {
                      await setCashRecieve(e.target.value);
                    }}
                    className="rounded w-1/2 h-8 px-2"
                  />
                </div>
                <div className="flex flex-row  sm:flex-col xs-flex-col gap-2 justify-end items-center">
                  <h3 className="text-sm  text-gray-600 font-normal">
                    Change:
                  </h3>
                  <h3 className="text-lg font-semibold text-green-600">
                    GH₵ {change}
                  </h3>
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className="flex my-3 pt-3 border-t border-dashed border-emerald-500">
              <h3 className="grow font-bold text-gray-400">Total:</h3>
              <h3 className="font-bold">GH₵ {total}</h3>
            </div>
          </div>

          {cashRecieved >= total && selectedProducts.length ? (
            <button
              onClick={handleAddOrder}
              className=" border p-5 text-white py-2 w-full bg-emerald-500 rounded-xl font-bold mt-4 shadow-emerald-300 shadow-lg">
              Pay GH₵ {total}
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

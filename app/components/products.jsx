import { useContext } from "react";
import { ProductsContext } from "./ProductsContext";
import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function ProductItems({
  _id,
  name,
  price,
  description,
  picture,
}) {
  const queryClient = useQueryClient();

  const router = useRouter();
  const { setSelectedProducts } = useContext(ProductsContext);
  const { selectedProducts } = useContext(ProductsContext);

  const addToCart = () => {
    setSelectedProducts((prev) => [...prev, _id]);
    const cart = selectedProducts;
  };

  const moreOfThisProduct = async (e, id) => {
    e.preventDefault();
    await setSelectedProducts((prev) => [...prev, id]);
  };

  const lessOfThisProduct = async (e, id) => {
    e.preventDefault();
    const pos = selectedProducts.indexOf(id);
    if (pos !== -1) {
      const newSelectProducts = selectedProducts.filter(
        (value, index) => index !== pos
      );
      await setSelectedProducts(newSelectProducts);
    }
  };

  return (
    <>
      <div className=" w-64 ">
        <div className="bg-gray-100 p-5 rounded-xl w-26">
          <img className="" src={picture} alt="" />
        </div>
        <div className="mt-2">
          <h3 className="font-bold text-lg">{name}</h3>
        </div>
        <p className="text-sm mt-1 leading-4 text-gray-500">{description}</p>
        <div className="flex mt-1">
          <div className="text-2xl font-bold grow">Gh₵ {price}</div>
          <div>
            <button
              onClick={(e) => lessOfThisProduct(e, _id)}
              className="border border-emerald-500 py-1 px-3  text-emerald-500">
              -
            </button>
            <span className="p-2">
              {selectedProducts.filter((id) => id === _id).length}
            </span>
            <button
              onClick={(e) => moreOfThisProduct(e, _id)}
              className="bg-emerald-500 py-1 px-3  text-white">
              +
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

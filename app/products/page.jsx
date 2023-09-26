export const runtime = "edge";

const getProdcts = async () => {
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
  const { products } = await getProdcts();
  //console.log(products);

  return (
    <>
      <div className="mt-20"> Products </div>

      <div className="p-10 mb-16">
        <ul role="list" className="divide-y divide-gray-100">
          {products.map((prod) => (
            <li key={prod._id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <img
                  className="h-12 w-12 flex-none rounded-full bg-gray-50"
                  src={prod.picture}
                  alt=""
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {prod.name}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {prod.description}
                  </p>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">${prod.price}</p>

                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">Available</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

import Dashboard from "./components/dashboard";
import { GetCategories } from "./actions/categoryActions";
import { GetProducts } from "./actions/productActions";
import { GetOrders } from "./actions/orderActions";

//export const runtime = "edge";

export default async function Home() {
  const categories = await GetCategories();
  const products = await GetProducts();
  const orders = await GetOrders();
  return (
    <>
      <div className="mt-16 mb-20">
        <Dashboard
          categories={categories}
          products={products}
          orders={orders}
        />
      </div>
    </>
  );
}

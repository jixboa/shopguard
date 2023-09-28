import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from "./utils/reactQueryProvider";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

import NavbarNew from "./components/navigation";
//import { cookies } from "next/headers";
//import { NextUIProvider } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import { ProductsContextProvider } from "./components/ProductsContext";

const inter = Inter({ subsets: ["latin"] });

/* const tokenData = async () => {
  const auth = await cookies().get("token")?.value;
  console.log(auth);
}; */

export const metadata = {
  title: "ShopGuard",
  description: "A swift retail center",
};

export default function RootLayout({ children }) {
  //tokenData()
  return (
    <Provider>
      <ProductsContextProvider>
        <html lang="en">
          <body className={inter.className}>
            <div className="">
              <div className="">
                {" "}
                <NavbarNew />
              </div>
              <Toaster position="top-center" reverseOrder={false} />
              {children}
            </div>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            <Footer />
          </body>
        </html>
      </ProductsContextProvider>
    </Provider>
  );
}

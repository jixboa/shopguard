import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from "./utils/reactQueryProvider";
import Footer from "./components/footer";

import NavbarNew from "./components/navigation";
//import { cookies } from "next/headers";
//import { NextUIProvider } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import { ProductsContextProvider } from "./components/ProductsContext";

//import { getTokenData } from "./utils/getTokenData";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ShopGuard",
  description: "A swift retail center",
};

export default async function RootLayout({ children }) {
  // const userData = await getTokenData();

  let username = "name";
  /*  if (userData.id) {
    username = await userData.username;
  }
 */
  return (
    <Provider>
      <ProductsContextProvider>
        <html lang="en">
          <body className={inter.className}>
            <div className="">
              <div className="">
                {username ? (
                  <>
                    <NavbarNew />
                  </>
                ) : null}
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

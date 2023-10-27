import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from "./utils/reactQueryProvider";
import Footer from "./components/footer";

import NavbarNew from "./components/navigation";
import SidebarComponent from "./components/sidebarComponent";
import toast, { Toaster } from "react-hot-toast";
import { ProductsContextProvider } from "./components/ProductsContext";

//const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ShopGuard",
  description: "A swift retail center",
};

export default async function RootLayout({ children }) {
  return (
    <Provider>
      <ProductsContextProvider>
        <html lang="en">
          <body>
            <div className="flex">
              <div className="">
                <SidebarComponent />
              </div>
              <div className="p-7 ml-20 mb-20 flex-1">
                <div className="w-full">
                  <NavbarNew />
                </div>
                <Toaster position="top-center" reverseOrder={false} />
                {children}
              </div>
            </div>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            {/*   <Footer /> */}
          </body>
        </html>
      </ProductsContextProvider>
    </Provider>
  );
}

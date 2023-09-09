import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from "./utils/reactQueryProvider";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

import toast, { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ShopGuard",
  description: "A swift retail center",
};

export default function RootLayout({ children }) {
  return (
    <Provider>
      <html lang="en">
        <body className={inter.className}>
          <div className=" px-5">
            <div className="">
              <Navbar />
            </div>
            <Toaster position="top-center" reverseOrder={false} />
            {children}
          </div>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <Footer />
        </body>
      </html>
    </Provider>
  );
}

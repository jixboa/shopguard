import "./globals.css";
import { Inter } from "next/font/google";
import { ReactQueryProvider } from "./reactQueryProvider";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Navbar from "./components/navbar";
//import Test from "@/app/components/Test";
import toast, { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ShopGuard",
  description: "A swift retail center",
};

export default function RootLayout({ children }) {
  return (
    <ReactQueryProvider>
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
        </body>
      </html>
    </ReactQueryProvider>
  );
}

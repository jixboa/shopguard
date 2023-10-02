"use client";

import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, Badge, IconButton } from "@material-tailwind/react";

import { ProductsContext } from "./ProductsContext";

import { Fragment, useContext } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/", current: true },
  { name: "Categories", href: "/categories", current: false },
  { name: "Products", href: "/products", current: false },
  { name: "Sales", href: "/sales", current: false },
  { name: "Add User", href: "/users/signup", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavbarNew() {
  const router = useRouter();
  const pathname = usePathname();

  const { selectedProducts } = useContext(ProductsContext);

  //console.log(pathname);

  const SignOut = async () => {
    try {
      await axios.get("/api/users/signout");
      toast.success("Logout successful");
      router.push("/users/signin");
    } catch (error) {
      console.log(error.message);
      toast.error("Logout failed");
    }
  };

  if (pathname === "/users/signin") {
    return (
      <>
        <div></div>
      </>
    );
  }

  return (
    <Disclosure as="nav" className="bg-gray-800 fixed top-0 w-full">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  {/*  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  /> */}
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    <Link
                      href="/"
                      className={classNames(
                        pathname === "/"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}>
                      Dashboard
                    </Link>
                    <Link
                      href="/sales"
                      className={classNames(
                        pathname === "/sales"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}>
                      Sales
                    </Link>
                    <Link
                      href="/products"
                      className={classNames(
                        pathname === "/products"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}>
                      Products
                    </Link>
                    <Link
                      href="/categories"
                      className={classNames(
                        pathname === "/categories"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}>
                      Categories
                    </Link>
                    <Link
                      href="/orders"
                      className={classNames(
                        pathname === "/orders"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}>
                      Orders
                    </Link>
                    <Link
                      href="/users/signup"
                      className={classNames(
                        pathname === "/users/signup"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}>
                      Add User
                    </Link>
                  </div>
                </div>
              </div>

              <div className="absolute inset-y-0 right-0 flex gap-5  pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div>
                  <Badge
                    onClick={(e) => {
                      router.push("/checkout");
                    }}
                    withBorder
                    className="font-bold mr-6 cursor-pointer"
                    content={
                      selectedProducts.length > 0 ? (
                        <span className="">{selectedProducts.length} </span>
                      ) : (
                        ""
                      )
                    }>
                    <IconButton
                      className="p-2 bg-opacity-0 ml-2"
                      onClick={(e) => {
                        router.push("/checkout");
                      }}>
                      <ShoppingCartIcon className="h-7 w-7 ml-4" />
                    </IconButton>
                  </Badge>
                </div>
                {/* <button
                  type="button"
                  onClick={(e) => {
                    router.push("/checkout");
                  }}
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 flw">
                  <span className="absolute -inset-1.5" />
                  <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}
                {/*  {selectedProducts.length > 0 ? (
                  <span className="">{selectedProducts.length}</span>
                ) : (
                  <></>
                )} */}

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <Avatar
                        variant="rounded"
                        className="h-8 w-8 rounded-full"
                        src="/images/placeholder.png"
                        alt="avatar"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}>
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}>
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={SignOut}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}>
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}>
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

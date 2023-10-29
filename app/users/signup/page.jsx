"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

import { data } from "../../data/data";

import { Spinner } from "@material-tailwind/react";

export default function SignUp() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (
      user.username.length > 0 &&
      user.email.length &&
      user.password.length > 0
    ) {
      setButtonDisabled(false);
    }
  }, [user]);

  const onSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log(user);
      const response = await axios.post("/api/users/signup", user);
      toast.success("User Added");
      console.log("Signup successfull", response.data);
      router.push("/users/signin");
    } catch (error) {
      console.log("Signup failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-2 mt-10">
        <div className="p-4 lg:h-[100vh] h-[70vh] overflow-scroll">
          <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
            <div className="my-3 p-2 grid md:grid-cols-4 grid-cols-2 items-center justify-between cursor-pointer">
              <span>Name</span>
              <span className="sm:text-left text-right">email</span>
              <span className="hidden md:grid">Role</span>
              <span className="hidden sm:grid">Status</span>
            </div>
          </div>
          <ul>
            {data.map((order, id) => (
              <li
                key={id}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 align-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <UserIcon className="h-4 w-4 text-purple-800" />
                  </div>
                  <p className="pl-4">
                    {order.name.first + " " + order.name.last}
                  </p>
                </div>
                <p className="text-gray-600 sm:text-left text-right  items-center text-sm p-2">
                  {order.name.first}@gmail.com
                </p>
                <p className=" hidden md:flex text-gray-600 sm:text-left text-right  items-center text-sm p-2">
                  User
                </p>
                <div className=" flex-row justify-between hidden md:flex">
                  <p className="  sm:text-left text-right  items-center text-sm text-white p-2 rounded-md bg-green-500">
                    Active
                  </p>
                  <PencilSquareIcon className="h-4 w-4" />
                  <TrashIcon className="h-4 w-4" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 justify-end">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {loading ? "Creating user" : "Add User"}
            </h2>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Full name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    onChange={(e) =>
                      setUser({ ...user, username: e.target.value })
                    }
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="py-3">
                  <button
                    onClick={onSignup}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    {buttonDisabled ? "Complete  form" : "Signup"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

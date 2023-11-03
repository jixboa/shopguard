"use client";

import { data } from "../data/data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useContext, useEffect, useState } from "react";

import {
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

export default function UserList() {
  return (
    <>
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
                <div className="bg-gray-200 p-3 rounded-lg">
                  <UserIcon className="h-4 w-4 text-gray-800" />
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
                <p className="  sm:text-left text-right  items-center text-sm text-white p-2 rounded-lg bg-green-500">
                  Active
                </p>
                <PencilSquareIcon className="h-4 w-4" />
                <TrashIcon className="h-4 w-4" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

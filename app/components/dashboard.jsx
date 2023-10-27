"use client";

import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

import BarChart from "./barchart";
import RecentOrders from "./recentOders";

import { ProductsContext } from "./ProductsContext";
import { Fragment, useContext, useEffect, useState } from "react";
import React, { PureComponent } from "react";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function Dashboard() {
  const { userDetail, setUserDetail } = useContext(ProductsContext);

  useEffect(() => {
    // Define the API request within the useEffect

    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        setUserDetail(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  return (
    <>
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="bg-gray-200 p-2 bg-gradient-to-r from-purple-400 to-purple-700 bg-opacity-50 shadow-md shadow-gray-800 hover:bg-purple-900 cursor-pointer rounded-xl">
          <div className="pl-4 pt-3 ">
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-2 text-white">
              Products
            </Typography>
          </div>
          <div className="pr-4">
            <Typography
              className="text-right font-extrabold h-25 text-8xl text-white pl-15 "
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
              140
            </Typography>
          </div>
          <div className="pl-4">
            <Button className="bg-purple-800 mb-5">See Details</Button>
          </div>
        </div>
        <div className="bg-gray-200 p-2 bg-gradient-to-r from-cyan-400 to-cyan-700 bg-opacity-50 shadow-md shadow-gray-800 hover:bg-purple-900 cursor-pointer rounded-xl">
          <div className="pl-4 pt-3">
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-2 text-white">
              Categories
            </Typography>
          </div>
          <div className="pr-4">
            <Typography
              className="text-right font-extrabold h-25 text-8xl text-white pl-15 "
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
              35
            </Typography>
          </div>
          <div className="pl-4">
            <Button className="bg-cyan-800 mb-5">See Details</Button>
          </div>
        </div>
        <div className="bg-gray-200 p-2 bg-gradient-to-r from-orange-400 to-orange-700 bg-opacity-50 shadow-md shadow-gray-800 hover:bg-purple-900 cursor-pointer rounded-xl">
          <div className="pl-4 pt-3">
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-2 text-white">
              Sales
            </Typography>
          </div>
          <div className="">
            <Typography
              className="p-1 mx-auto text-right font-extrabold h-25 text-5xl xs:text-5xl text-white flex flex-col"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
              $117,500.00
            </Typography>
          </div>
          <div className="pl-4">
            <Button className="bg-orange-800 mt-10">See Details</Button>
          </div>
        </div>
      </div>

      <div>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          <RecentOrders />
          <BarChart />
        </div>
      </div>
    </>
  );
}

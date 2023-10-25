"use client";

import { ProductsContext } from "./ProductsContext";
import { Fragment, useContext, useEffect, useState } from "react";

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
      <h1>Dashboard {userDetail?.username}</h1>
    </>
  );
}

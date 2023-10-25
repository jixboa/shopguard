"use client";

import { ProductsContext } from "./ProductsContext";
import { Fragment, useContext, useEffect, useState } from "react";

export default function Dashboard({ id, username, email, lat, exp }) {
  const { userDetail, setUserDetail } = useContext(ProductsContext);

  return (
    <>
      <h1>Dashboard {username}</h1>
    </>
  );
}

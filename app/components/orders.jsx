"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { useState } from "react";

import { PencilIcon } from "@heroicons/react/24/solid";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";

const TABLE_HEAD = [
  "Name",
  "Contact",
  "Invoice No.",
  "Amount",
  "Date",
  "Status",
  "",
];

const TABLE_ROWS = [
  {
    img: "/img/logos/logo-spotify.svg",
    name: "Spotify",
    amount: "$2,500",
    date: "Wed 3:00pm",
    status: "paid",
    account: "visa",
    accountNumber: "1234",
    expiry: "06/2026",
  },
  {
    img: "/img/logos/logo-amazon.svg",
    name: "Amazon",
    amount: "$5,000",
    date: "Wed 1:00pm",
    status: "paid",
    account: "master-card",
    accountNumber: "1234",
    expiry: "06/2026",
  },
  {
    img: "/img/logos/logo-pinterest.svg",
    name: "Pinterest",
    amount: "$3,400",
    date: "Mon 7:40pm",
    status: "pending",
    account: "master-card",
    accountNumber: "1234",
    expiry: "06/2026",
  },
  {
    img: "/img/logos/logo-google.svg",
    name: "Google",
    amount: "$1,000",
    date: "Wed 5:00pm",
    status: "paid",
    account: "visa",
    accountNumber: "1234",
    expiry: "06/2026",
  },
  {
    img: "/img/logos/logo-netflix.svg",
    name: "netflix",
    amount: "$14,000",
    date: "Wed 3:30am",
    status: "cancelled",
    account: "visa",
    accountNumber: "1234",
    expiry: "06/2026",
  },
];

const getOrders = async () => {
  try {
    const res = await fetch(`/api/orders`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed loading Orders");
    }

    const data = await res.json();
    return data.orders; // Return the orders array
  } catch (error) {
    console.log("error Loading Orders", error);
  }
};

export default function OrdersClient() {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Number of items to display per page

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const paginatedData = data.slice(offset, offset + itemsPerPage);

  return (
    <div className="mt-20 mb-20 p-5">
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                Recent Transactions
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                These are details about the last transactions
              </Typography>
            </div>
            <div className="flex w-full shrink-0 gap-2 md:w-max">
              <div className="w-full md:w-72">
                <Input
                  label="Search"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </div>
              <Button className="flex items-center gap-3" size="sm">
                <ArrowDownTrayIcon strokeWidth={2} className="h-4 w-4" />{" "}
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70">
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map(
                (
                  {
                    name,
                    contact,
                    invoice_number,
                    total_amount,
                    date,
                    paid,
                    products,
                  },
                  index
                ) => {
                  const isLast = index === TABLE_ROWS.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr
                      key={invoice_number}
                      className="even:bg-blue-gray-50/50">
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          {/* <Avatar
                            src={img}
                            alt={name}
                            size="md"
                            className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                          /> */}
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold">
                            {name}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal">
                          {contact}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold">
                          {invoice_number}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal">
                          ${total_amount}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal">
                          {date}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            size="sm"
                            variant="ghost"
                            className="border border-slate-200"
                            value={paid}
                            color={
                              paid === "paid"
                                ? "green"
                                : status === "pending"
                                ? "amber"
                                : "red"
                            }
                          />
                        </div>
                      </td>
                      {/* <td className={classes}>
                      <ol className="mb-10">
                        {products &&
                          products.map((product, index) => (
                            <li
                              className=" bg-slate-400 border border-zinc-300"
                              key={product.name}>
                              Product Name: {product.name}, Quantity:{" "}
                              {product.quantity}, Unit Amount:{" "}
                              {product.unit_amount}
                            </li>
                          ))}
                      </ol>
                    </td> */}
                      <td className={classes}>
                        <Tooltip content="Edit User">
                          <IconButton variant="text">
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          {/* <Button variant="outlined" size="sm">
            Previous
          </Button>
          <div className="flex items-center gap-2">
            <IconButton variant="outlined" size="sm">
              1
            </IconButton>
            <IconButton variant="text" size="sm">
              2
            </IconButton>
            <IconButton variant="text" size="sm">
              3
            </IconButton>
            <IconButton variant="text" size="sm">
              ...
            </IconButton>
            <IconButton variant="text" size="sm">
              8
            </IconButton>
            <IconButton variant="text" size="sm">
              9
            </IconButton>
            <IconButton variant="text" size="sm">
              10
            </IconButton>
          </div>
          <Button variant="outlined" size="sm">
            Next
          </Button> */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 20,
              boxSizing: "border-box",
              width: "100%",
              height: "100%",
            }}>
            <ReactPaginate
              pageCount={Math.ceil(data.length / itemsPerPage)}
              pageRangeDisplayed={5}
              marginPagesDisplayed={2}
              onPageChange={handlePageChange}
              pageClassName={"bg-slate-200 text-gray-600 border rounded px-4"}
              containerClassName="flex flex-row justify-center gap-3"
              activeClassName="border  bg-grsy-800 text-white px-4 rounded mx-4"
              nextLabel={<ArrowRightIcon style={{ fontSize: 18, width: 20 }} />}
              previousLabel={
                <ArrowLeftIcon style={{ fontSize: 18, width: 20 }} />
              }
            />
          </div>
        </CardFooter>
      </Card>

      {/* <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Date</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => (
            <tr key={order._id}>
              <td>{order.name}</td>
              <td>{order.contact}</td>
              <td>{order.date}</td>
              <td>
                <ul className="mb-10">
                  {order.products &&
                    order.products.map((product, index) => (
                      <li
                        className=" bg-slate-400 border border-zinc-300"
                        key={product.name}>
                        Product Name: {product.name}, Quantity:{" "}
                        {product.quantity}, Unit Amount: {product.unit_amount}
                      </li>
                    ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
}

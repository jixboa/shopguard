"use client";

import {
  List,
  ListItem,
  ListItemSuffix,
  Card,
  IconButton,
} from "@material-tailwind/react";

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
} from "@material-tailwind/react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Spinner } from "@material-tailwind/react";

import { MdDelete, MdEdit, MdEditNotifications } from "react-icons/md";

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5">
      <path
        fillRule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

//get cats
const getCategories = async () => {
  try {
    const res = await fetch(`/api/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed loading Categories");
    }

    const data = await res.json();
    return data.categories; // Return the categories array
  } catch (error) {
    console.log("error Loading Categories", error);
  }
};

//main function
export function CategoryClient() {
  const queryClient = useQueryClient();

  const [category, setCategory] = useState({
    name: "",
  });

  const [editCat, setEditCat] = useState({
    _id: "",
    name: "",
  });

  const [delCategoryID, setDelCategoryID] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen((cur) => !cur);
  };

  const [editOpen, setEditOpen] = useState(false);

  const handleEditOpen = (category) => {
    setEditCat({ ...editCat, name: category.name, id: category._id });
    setEditOpen((cur) => !cur);
  };

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteOpen = (id) => {
    setDelCategoryID(id);
    setDeleteOpen((cur) => !cur);
  };

  const deleteHandler = async (deletedCat) => {
    //console.log(deletedCat._id);
    const id = delCategoryID;

    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      return responseData.message; // Product deleted successfully message
    } catch (error) {
      console.error("Error deleting Cat:", error);
      throw error;
    }
  };

  const delMutation = useMutation({
    mutationFn: deleteHandler,
    onMutate: async (delCategoryID) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      const previousCategories = queryClient.getQueriesData(["categories"]);
      const newCats = previousCategories[0][1];

      queryClient.setQueriesData(
        ["categories"],
        newCats.filter((category) => category._id !== delCategoryID)
      );
      return { newCats };
    },
    onError: (err, category, context) => {
      queryClient.setQueriesData(["categories"]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onSuccess(data, variables, context) {
      setDeleteOpen(false);
      toast.success("Deleted successfuly");
    },
  });

  const [showEditCategory, setShowEditCategory] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading) {
    return (
      <>
        <div>
          <h2 className="text-black">Loading...</h2>
        </div>
      </>
    );
  }

  const updateCategory = async () => {
    const newName = editCat.name;
    const id = editCat._id;
    try {
      const res = await fetch(`api/categories/${editCat.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ newName }),
      });

      if (!res.ok) {
        throw new Error("success upate Category");
      }
    } catch (error) {}
  };

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onMutate: async (updatedCat) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      const previousCategories = queryClient.getQueriesData(["categories"]);
      const newCats = previousCategories[0][1];

      // Assuming your updateCategory function returns the updated category
      queryClient.setQueriesData(
        ["categories"],
        newCats.map((category) =>
          category._id === updatedCat._id ? updatedCat : category
        )
      );
      return { newCats };
    },
    onError: (err, category, context) => {
      queryClient.setQueriesData(["categories"]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onSuccess(data, variables, context) {
      setEditOpen(false);
      toast.success("Updated successfully");
    },
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate(editCat);
  };

  const addCategory = async () => {
    //e.preventDefault();
    try {
      //setLoading(true);
      const response = await axios.post(`/api/categories`, category);
      toast.success("Created successfully");
      return response.data;
    } catch (error) {
      console.log("Creating Failed", error.message);
      toast.error(error.message);
    } finally {
      //setLoading(false);
      setOpen(false);
    }
  };

  const addMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: async (data) => {
      // Update the cache with the newly added category
      await queryClient.setQueriesData("categories", (oldData) => [
        ...oldData,
        data,
      ]);
    },
  });

  const handleAddCategory = (e) => {
    e.preventDefault();
    // Call the mutation to add the new category
    addMutation.mutate(category);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/*       <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        {showAddCategory && <AddCategory />}
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        {showEditCategory && <EditCategory />}
      </div> */}
      <div className="margin-auto py-10 px-60">
        <div className="flex flex-row justify-between mt-20">
          <h1 className=" flex flex-grow"></h1>
          <button
            onClick={handleOpen}
            className="bg-blue-800 text-white px-2 rounded">
            Add +
          </button>
        </div>

        <Card className="justify-center mb-16">
          <List>
            {data.map((category) => (
              <ListItem
                key={category._id}
                ripple={false}
                className="py-1 pr-1 pl-4 border-b-2">
                {category.name}{" "}
                <Typography className="border bg-green-400 text-white rounded-md px-1 text-sm ml-2">
                  Active
                </Typography>
                <ListItemSuffix className="flex flex-row gap-2">
                  <IconButton
                    onClick={() => handleEditOpen(category)}
                    variant="text"
                    color="blue-gray">
                    <MdEdit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteOpen(category._id)}
                    variant="text"
                    color="blue-gray">
                    <TrashIcon />
                  </IconButton>
                </ListItemSuffix>
              </ListItem>
            ))}
          </List>
        </Card>

        <Dialog
          size="xs"
          open={open}
          handler={handleOpen}
          className="bg-transparent shadow-none">
          <Card className="mx-auto w-full max-w-[24rem]">
            <CardHeader
              color="blue"
              className="mb-4 grid h-28 place-items-center bg-blue-600">
              <Typography
                variant="h2"
                color="white"
                className="font-bold text-lg">
                Add New Category
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="fullname"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Category name
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      onChange={(e) =>
                        setCategory({ ...category, name: e.target.value })
                      }
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="py-2">
                    <button
                      type="submit"
                      onClick={handleAddCategory}
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      Add Category
                    </button>
                  </div>
                </div>
              </form>
            </CardBody>
            <CardFooter className="pt-0">
              <Button className="bg-red-800" onClick={handleOpen} fullWidth>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </Dialog>
        <Dialog
          size="xs"
          open={editOpen}
          handler={handleEditOpen}
          className="bg-transparent shadow-none">
          <Card className="mx-auto w-full max-w-[24rem]">
            <CardHeader
              color="blue"
              className="mb-4 grid h-28 place-items-center bg-blue-600">
              <Typography
                variant="h2"
                color="white"
                className="font-bold text-lg">
                Edit Category
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label
                    htmlFor="fullname"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Category name
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={editCat.name}
                      autoComplete="name"
                      onChange={(e) =>
                        setEditCat({ ...editCat, name: e.target.value })
                      }
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="py-2">
                    <button
                      type="submit"
                      onClick={(e) => {
                        handleUpdate(e);
                      }}
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      Update Category
                    </button>
                  </div>
                </div>
              </form>
            </CardBody>
            <CardFooter className="pt-0">
              <Button className="bg-red-800" onClick={handleEditOpen} fullWidth>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </Dialog>

        <Dialog
          open={deleteOpen}
          size="sm"
          className="w-100"
          handler={handleDeleteOpen}>
          <DialogHeader>Deleting category</DialogHeader>
          <DialogBody divider>
            Are you sure you want to Delete this category permanently?
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => handleDeleteOpen(null)}
              className="mr-1">
              <span>Cancel</span>
            </Button>
            <Button
              variant="gradient"
              color="green"
              className="bg-green-400 text-white text-sm"
              onClick={() => delMutation.mutate(delCategoryID)}>
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </>
  );
}

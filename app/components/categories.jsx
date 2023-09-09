"use client";

import {
  List,
  ListItem,
  ListItemSuffix,
  Card,
  IconButton,
} from "@material-tailwind/react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { MdDelete } from "react-icons/md";

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
    const res = await fetch("/api/categories", {
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
  const [category, setCategory] = React.useState({
    name: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category.name.length > 0) {
      setButtonDisabled(false);
    }
  }, [category]);

  const deleteHandler = async (deletedCat) => {
    console.log(deletedCat._id);
    const id = deletedCat._id;

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
    onMutate: async (deletedCat) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      const previousCategories = queryClient.getQueriesData(["categories"]);
      const newCats = previousCategories[0][1];

      queryClient.setQueriesData(
        ["categories"],
        newCats.filter((category) => category._id !== deletedCat._id)
      );
      return { newCats };
    },
  });

  const addCategory = async () => {
    //e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/categories", category);
      toast.success("Created successfully");
      return response.data;
    } catch (error) {
      console.log("Creating Failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const { mutate } = useMutation(addCategory, {
    onSuccess: async (data) => {
      await console.log(data);
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
    mutate(category);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {loading ? "Creating Category" : "Add new Category"}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
                  {buttonDisabled ? "Enter new Category" : "Add Category"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="margin-auto">
        <h1>Categories</h1>

        <Card className="justify-center">
          <List>
            {data.map((category) => (
              <ListItem
                key={category._id}
                ripple={false}
                className="py-1 pr-1 pl-4">
                {category.name}
                <ListItemSuffix>
                  <IconButton
                    key={category._id}
                    onClick={() => delMutation.mutate(category)}
                    variant="text"
                    color="blue-gray">
                    <TrashIcon />
                  </IconButton>
                </ListItemSuffix>
              </ListItem>
            ))}
          </List>
        </Card>
      </div>
    </>
  );
}

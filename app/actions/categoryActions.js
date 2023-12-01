// Your Server Action file
"use server";

import { revalidatePath } from "next/cache";
import connectMongo from "../../database/conn";
import Category from "../../models/categorySchema";

export async function AddCategory(data) {
  await connectMongo();

  try {
    let name = data.get("name")?.valueOf();
    const saveCategory = new Category({ name });

    const newCategory = await saveCategory.save();

    const simplifiedCategory = JSON.parse(JSON.stringify(newCategory));

    return simplifiedCategory;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  } finally {
    revalidatePath("/categories");
  }
}

// Server
export async function GetCategories() {
  await connectMongo();
  try {
    const categories = await Category.find({});

    // Convert the array of objects to plain JavaScript objects
    const simplifiedCategories = categories.map((category) =>
      JSON.parse(JSON.stringify(category))
    );

    return simplifiedCategories;
  } catch (error) {
    console.error("Error retrieving categories:", error);
    throw error;
  }
}

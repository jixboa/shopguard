// Your Server Action file
"use server";

import connectMongo from "../database/conn";
import Category from "../models/categorySchema";

export async function AddCategory() {
  await connectMongo();

  try {
    const name = "Kwame";
    const saveCategory = new Category({ name });
    const newCategory = await saveCategory.save();
    console.log(name);

    return newCategory;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

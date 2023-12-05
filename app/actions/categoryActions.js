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

    const serialisedCategory = categories.map((category) => {
      return { ...category._doc, _id: category._id.toString() };
    });
    //console.log(serialisedCategory);

    // Convert the array of objects to plain JavaScript objects
    /*  const simplifiedCategories = categories.map((category) =>
      JSON.parse(JSON.stringify(category))
    ); */
    return serialisedCategory;
  } catch (error) {
    console.error("Error retrieving categories:", error);
    throw error;
  }
}

export async function DeleteCategory(ID) {
  await connectMongo();

  const id = ID;
  if (!id) {
    return NextResponse.json("Id not Received");
  }

  try {
    await Category.findByIdAndDelete(id);
    revalidatePath("/categories");
  } catch (error) {
    console.log(error);
  }
  /*  return NextResponse.json({ message: "Cat deleted" }, { status: 200 }); */
}

export async function UpdateCategory(editCat) {
  const id = editCat.id;
  const name = editCat.name;
  await connectMongo();

  await Category.findByIdAndUpdate(id, { name });
  revalidatePath("/categories");
}

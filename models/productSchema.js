import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: String,
  discription: String,
  price: Number,
  category: String,
  picture: String,
});

const Product = models?.Product || model("Product", ProductSchema);

export default Product;

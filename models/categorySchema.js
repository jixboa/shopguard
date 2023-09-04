import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  name: String,
  discription: String,
  price: Number,
  category: String,
  picture: String,
});

const Category = models?.Category || model("Category", CategorySchema);

export default Product;

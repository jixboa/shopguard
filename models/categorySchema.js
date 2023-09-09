import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  name: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Category = models?.Category || model("Category", CategorySchema);

export default Category;

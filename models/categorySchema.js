const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

mongoose.models = {};

module.exports = mongoose.model("Category", CategorySchema);
/* const Category = models?.Category || model("Category", CategorySchema);

export default Category; */

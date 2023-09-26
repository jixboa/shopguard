import mongoose from "mongoose";

const conn = require("../config/keys").mongoLocal;

const connectMongo = async () => {
  try {
    await mongoose.connect(conn, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectMongo;

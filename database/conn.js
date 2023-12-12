import mongoose from "mongoose";

let isConnected = false; // Variable to track the connection status

export default async function connectMongo() {
  // Set strict query mode for Mongoose to prevent unknown field queries.
  mongoose.set("strictQuery", true);

  if (!process.env.mongoURI) return console.log("Missing MongoDB URL");

  // If the connection is already established, return without creating a new connection.
  if (isConnected) {
    // console.log("MongoDB connection already established");
    return;
  }

  try {
    await mongoose.connect(process.env.mongoURI);

    isConnected = true; // Set the connection status to true
    //console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
}

import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    products: Object,
    name: String,
    contact: String,
    paid: { type: Number, defaultValue: 0 },
  },
  { timestamp: true }
);

const Order = models?.Order || model("Order", OrderSchema);

export default Order;

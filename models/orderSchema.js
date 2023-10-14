import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    products: Object,
    name: String,
    contact: String,
    total_amount: String,
    invoice_number: String,
    paid: { type: String, defaultValue: " " },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamp: true }
);

const Order = models?.Order || model("Order", OrderSchema);

export default Order;

const { object } = require("joi");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        id: { type: String },
        name: { type: String },
        brand: { type: String },
        desc: { type: String },
        price: { type: String },
        image: { type: Object },
        cartQuantity: { type: Number },
      },
    ],
    subtotal: { type: Number, required: true },
    delivery_status: { type: String, default: "pending" },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

exports.Order = Order;

const mongoose = require("mongoose");

const SingleOrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  amount: { type: String, required: true },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const OrderShcema = new mongoose.Schema(
  {
    tax: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientSecret: { type: String, required: true },
    paymentId: { type: String},
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", OrderShcema);

const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: String,
  transactionId: String,
  receiptNumber: String,
  checkoutRequestId: String,
  merchantRequestId: String,
  paymentPhone: String,
  paymentDate: Date,
  shippingAddress: {
    address: String,
    city: String,
    country: String,
    zipCode: String,
  },
  phone: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

module.exports = mongoose.model("Order", OrderSchema);

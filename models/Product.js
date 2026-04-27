const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a product name"],
  },
  description: String,
  price: {
    type: Number,
    required: [true, "Please provide a price"],
  },
  category: {
    type: String,
    enum: ["skincare", "makeup", "haircare", "bodycare", "fragrance"],
    required: true,
  },
  image: String,
  stock: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      comment: String,
      rating: Number,
      createdAt: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", ProductSchema);

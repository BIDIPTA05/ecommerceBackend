const mongoose = require("mongoose");
const Product = require("./product");


const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, default: 1 },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);

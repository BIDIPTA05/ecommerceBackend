const mongoose = require("mongoose");
const Product = require("./product");

const wishlistSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  password: { type: String, required: true },

  isSuperAdmin: { type: Boolean, default: false },
  
  wishList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ]
  // cart: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Product",
  //   },
  // ],

  // orders: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Order",
  //   },
  // ],


});

module.exports = mongoose.model("User", userSchema);

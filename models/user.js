const mongoose = require("mongoose");
const Product = require("./product");

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
  
  wishlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wishlist" }],
});

module.exports = mongoose.model("User", userSchema);

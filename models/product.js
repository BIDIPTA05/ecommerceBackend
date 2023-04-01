const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true, default: 0 },
  description: { type: String, required: true },
  productImage: { type: String, required: true },
  category: { type: String, required: true },
});



module.exports = mongoose.model("Product", productSchema);

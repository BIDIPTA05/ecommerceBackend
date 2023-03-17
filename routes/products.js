const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");


//GET ROUTE
router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      message: "Handling GET requests to /products", console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});



//POST ROUTE
router.post("/", (req, res, next) => {
  // const product = {
  //     name: req.body.name,
  //     price: req.body.price
  // };
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });

  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});



//GET SINGLE PRODUCT ROUTE
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  // if (id === 'special') {
  //     res.status(200).json({
  //         message: 'You discovered the special ID',
  //         id: id
  //     });
  // } else {
  //     res.status(200).json({
  //         message: 'You passed an ID'
  //     });
  // }
  Product.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        console.log(doc);
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});



//UPDATE PRODUCT ROUTE
router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

  Product.findByIdAndUpdate(
    { _id: id },
    { $set: updateOps }
  )
    .exec()
    .then((result) => {
      console.log("Updated Successfully");
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });

  res.status(200).json({
    message: "Updated product!",
  });
});




//DELETE PRODUCT ROUTE
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findByIdAndDelete({ _id: id })
    .exec()
    .then((result) => {
      console.log("Deleted Successfully");
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });

  res.status(200).json({
    message: "Deleted product!",
  });
});



//EXPORT
module.exports = router;

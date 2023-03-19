const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");
const checkAuth = require("../middleware/auth_check");


//GET ROUTE- GET ALL PRODUCTS
router.get("/", (req, res, next) => {
  Product.find().select("name price _id")
    .exec()
    .then((docs) => {
      message: "Handling GET requests to /products",
        console.log(docs);
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});



//POST ROUTE- UPLOAD A PRODUCT
router.post("/",checkAuth, (req, res, next) => {
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
        message: "Created the product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id
          }
        },
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
    .select("name price _id")
    .exec()
    .then((doc) => {
      if (doc) {
        console.log(doc);
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "GET_ALL_PRODUCTS",
            url: "http://localhost:3000/products",
          },
        });
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
router.patch("/:productId", checkAuth,(req, res, next) => {
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
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});




//DELETE PRODUCT ROUTE
router.delete("/:productId",checkAuth, (req, res, next) => {
  const id = req.params.productId;
  Product.findByIdAndDelete({ _id: id })
    .exec()
    .then((result) => {
      console.log("Deleted Successfully");
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
          body: { name: "String", price: "Number" },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });


});



//EXPORT
module.exports = router;

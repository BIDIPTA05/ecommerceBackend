const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

//GET ALL ORDERS
router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id ")
    .populate("product", "name price")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        message: "Orders were fetched",
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});



//CREATE AN ORDER
router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      console.log(product);
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
        name: req.body.name,
      })
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({
            message: "Order created",
            createdOrder: {
              _id: result._id,
              product: result.product,
              quantity: result.quantity,
              
            },
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + result._id,
            },
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Product not found",
        error: err,
      });
    });
});
 

 

//FETCH A SINGLE ORDER
router.get("/:orderId", (req, res, next) => {

  Order.findById(req.params.orderId)

    .populate("product", "name price")
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      res.status(200).json({
        message: "Order details fetched",
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders",
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




//DELETE AN ORDER
router.delete("/:orderId", (req, res, next) => {

  Order.findByIdAndDelete({ _id: req.params.orderId })
    .exec().
    then((result) => {
    if(!result){
      return res.status(404).json({
        message: "Order not found",
      });
    }
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders",
          body: { productId: "ID", quantity: "Number" },
        },
      })

    }).catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      })
    })
});

module.exports = router;

const mongoose = require("mongoose")
const Product = require("../models/product")
const Cart = require("../models/cart")

exports.create_cart_control = (req, res, next) => {
  Cart.find({ product: req.body.productId })
    .exec()
    .then((cart) => {
      if (cart.length >= 1) {
        return res.status(409).json({
          message: "Product already in cart",
        });
      } else {
        const cart = new Cart({
          _id: new mongoose.Types.ObjectId(),
          product: req.body.productId,
          name: req.body.name,
        })
          .save()
          .then((result) => {
            console.log(cart);
            res.status(201).json({
              message: "Product added to Cart",

              createdCart: {
                _id: result._id,
                product: result.product,
                request: {
                  type: "GET",
                  url: "http://localhost:3000/cart/" + result._id,
                },
              },
            });
          })

          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    });
};


exports.get_cart_control = (req, res, next) => {
    Cart.find()
        .select("product quantity _id ")
        .populate("product", "name price")
        .exec()
        .then((docs) => {
        res.status(200).json({
            count: docs.length,
            message: "Cart was fetched",
            cart: docs.map((doc) => {
            return {
                _id: doc._id,
                product: doc.product,
                quantity: doc.quantity,
    
                request: {
                type: "GET",
                url: "http://localhost:3000/cart/" + doc._id,
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
    }
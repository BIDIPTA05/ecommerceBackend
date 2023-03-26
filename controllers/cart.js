const mongoose = require("mongoose");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Wishlist = require("../models/wishlist");
const Orders = require("../models/order");

//ADD TO CART
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

//GET ALL CART ITEMS
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
};

//SINGLE CART ITEM
exports.get_cart_item_control = (req, res, next) => {
  const id = req.params.cartId;
  Cart.findById(id)
    .populate("product", "name price")
    .exec()
    .then((doc) => {
      console.log("From Cart", doc);
      if (doc) {
        res.status(200).json({
          cart: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/cart",
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
      res.status(500).json({
        error: err,
      });
    });
};

//DELETE CART ITEM
exports.delete_cart_item_control = (req, res, next) => {
  const id = req.params.cartId;
  Cart.findByIdAndDelete(id)
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Cart item deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/cart",
          body: { productId: "ID", quantity: "Number" },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

//MOVE TO WISHLIST
exports.move_to_wishlist = (req, res, next) => {
  const productId = req.body.productId;
  // check if the product exists in the wishlist
  Cart.findById({ _id: productId })
    .exec()
    .then((cartitems) => {
      console.log({ cartitems });

      if (!cartitems) {
        return res.status(404).json({
          message: "Product not found in cart",
        });
      } else {
        // create a new cart item with the wishlist product details
        const wishlistItem = new Wishlist({
          _id: new mongoose.Types.ObjectId(),
          product: wishlistItem.product,
          name: wishlistItem.name,
        });
        // save the cart item to the cart collection
        wishlistItem
          .save()
          .then((result) => {
            console.log(result);
            // remove the product from the wishlist
            Cart.findByIdAndDelete(wishlistItem._id)
              .exec()
              .then(() => {
                res.status(200).json({
                  message: "Product moved from cart to wishlist",
                  movedItem: {
                    _id: result._id,
                    product: result.product,
                    name: result.name,
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
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};




//MOVE TO ORDERS
exports.move_to_orders = (req, res, next) => {
  const productId = req.body.productId;
  Cart.findById({ _id: productId })
    .exec()
    .then((cartitems) => {
      //console(cartitems);
      if (!cartitems) {
        req.status(404).json({
          message: "Product not found in cart",
        });
      } else {
        const orderitem = new Orders({
          _id: new mongoose.Types.ObjectId(),
          product: cartitems.product,
          name: cartitems.name,
        });
        orderitem
          .save()
          .then((result) => {
            //console.log(result);
            Cart.findByIdAndDelete(orderitem._id)
              .exec()
              .then(() => {
                res.status(200).json({
                  message: "Product moved from cart to orders",
                  movedItem: {
                    _id: result._id,
                    product: result.product,
                    name: result.name,
                    request: {
                      type: "GET",
                      url: "http://localhost:3000/cart/" + result._id,
                    },
                  },
                });
              })
              .catch((err) => {
                //console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          })
          .catch((err) => {
            //console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      //console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

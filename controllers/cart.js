const mongoose = require("mongoose");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Wishlist = require("../models/wishlist");
const Orders = require("../models/order");

//ADD TO CART
exports.create_cart_control = (req, res, next) => {

  const userId = req.userData.userId;

    if (userId == null) {
      return res.status(401).json({
        message: "You are not authorized to add to wishlist",
      });
    }
     Product.findById(req.body.productId)
    .exec()
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }  
  
      Cart.find({ product: req.body.productId })
        .exec()
        .then((existingCart) => {
          if (existingCart.length>=1) {
            return res.status(409).json({
              message: "Product already in cart",
            });
          }

          const cart = new Cart({
            _id: new mongoose.Types.ObjectId(),
            userId: userId,
            product: req.body.productId,
            name: product.name,
          });
            cart
            .save()
            .then((result) => {
              console.log(cart);
              res.status(201).json({
                message: "Product added to Cart",
                createdCart: {
                  _id: result._id,
                  userId: result.userId,
                  quantity: result.quantity,
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
        });
    })
};

//GET ALL CART ITEMS
exports.get_cart_control = (req, res, next) => {
  Cart.find({ userId: req.userData.userId })
    .populate("product")
    .exec()
    .then((cart) => {
      if (!cart) {
        return res.status(404).json({
          message: "Cart not found for the given user",
        });
      }
      if (cart.length === 0) {
        return res.status(404).json({
          message: "No items in cart",
        });
      }
      res.status(200).json({
        count: cart.length,
        message: "Cart was fetched",
        cart: cart.map((item) => {
          return {
            _id: item._id,
            product: item.product,
            quantity: item.quantity,
            userId: item.userId,
            request: {
              type: "GET",
              url: "http://localhost:3000/cart/" + item._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
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
      if (!doc) {
        return res.status(404).json({
          message: "No product found",
        });
      }
     
        res.status(200).json({
          cart: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/cart",
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


//DELETE CART ITEM
exports.delete_cart_item_control = (req, res, next) => {
  const id = req.params.cartId;
  Cart.findByIdAndDelete(id)
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: "Cart item not found",
        });
      }
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
          userId: cartitems.userId,
          product: cartitems.product,
          name: cartitems.name,
        });
        // save the cart item to the cart collection
        wishlistItem
          .save()
          .then((result) => {
            console.log(result);
            // remove the product from the wishlist
            Cart.findByIdAndDelete(cartitems._id)
              .exec()
              .then(() => {
                res.status(200).json({
                  message: "Product moved from cart to wishlist",
                  movedItem: {
                    _id: result._id,
                    product: result.product,
                    name: result.name,
                    userId: result.userId,
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
          userId: cartitems.userId
        });
        orderitem
          .save()
          .then((result) => {
            //console.log(result);
            Cart.findByIdAndDelete(cartitems._id)
              .exec()
              .then(() => {
                res.status(200).json({
                  message: "Product moved from cart to orders",
                  movedItem: {
                    _id: result._id,
                    product: result.product,
                    name: result.name,
                    userId: result.userId,
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

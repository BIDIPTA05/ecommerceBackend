const mongoose = require("mongoose");
const Cart = require("../models/cart");
const Wishlist = require("../models/wishlist");
const Product = require("../models/product");

//ALL ITEMS IN WISHLIST user specific
exports.get_wishlist_control = (req, res, next) => {
  Wishlist.find({ userId: req.userData.userId })
    .populate("product userId", "name price _id")
    .exec()
    .then((wishlist) => {
      if (wishlist.length == 0) {
        return res.status(404).json({
          message: "No items in wishlist",
        });
      }
      res.status(200).json({
        count: wishlist.length,
        wishlist: wishlist.map((item) => {
          return {
            _id: item._id,
            product: item.productId,
            name: item.name,
            userId: item.userId,
            request: {
              type: "GET",
              url: "http://localhost:3000/wishlist/" + item._id,
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


//ADD ITEM TO WISHLIST
// exports.create_wishlist_control = (req, res, next) => {
//   Wishlist.find({ product: req.body.productId })
//     .exec()
//     .then((wishlist) => {
//       if (wishlist.length >= 1) {
//         return res.status(409).json({
//           message: "Product already in wishlist",
//         });
//       } else {
//         const wishlist = new Wishlist({
//           _id: new mongoose.Types.ObjectId(),
//           product: req.body.productId,
//           name: req.body.name,
//         })
//           .save()
//           .then((result) => {
//             console.log(wishlist);
//             res.status(201).json({
//               message: "Product added to wishlist",

//               createdWishlist: {
//                 _id: result._id,
//                 product: result.product,
//                 request: {
//                   type: "GET",
//                   url: "http://localhost:3000/wishlist/" + result._id,
//                 },
//               },
//             });
//           })

//           .catch((err) => {
//             console.log(err);
//             res.status(500).json({
//               error: err,
//             });
//           });
//       }
//     });
// };

//ADD TO WISHLIST of specific loged in user
exports.create_wishlist_control = (req, res, next) => {
  if (req.userData.userId == null) {
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

      Wishlist.find({ product: req.body.productId })
        .exec()
        .then((wishlist) => {
          if (wishlist.length >= 1) {
            return res.status(409).json({
              message: "Product already in wishlist",
            })
          }
          else {
            const wishlist = new Wishlist({
              _id: new mongoose.Types.ObjectId(),
              userId: req.userData.userId, // Get the user ID from the decoded token
              product: req.body.productId,
            });
            console.log({ wishlist });
            wishlist
              .save()
              .then((result) => {
                console.log(wishlist);

                res.status(201).json({
                  message: "Product added to wishlist",
                  createdWishlist: {
                    _id: result._id,
                    product: result.product,
                    request: {
                      type: "GET",
                      url: "http://localhost:3000/wishlist/" + result._id,
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
        })
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
    );
};

//DELETE ITEM FROM WISHLIST
// exports.delete_wishlist_control = (req, res, next) => {
//   Wishlist.findByIdAndDelete({ _id: req.params.wishlistId })
//     .exec()
//     .then((result) => {
//       res.status(200).json({
//         message: "Product removed from wishlist",
//         request: {
//           type: "POST",
//           url: "http://localhost:3000/wishlist",
//           body: { productId: "ID" },
//         },
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         error: err,
//       });
//     });
// };


exports.delete_wishlist_control = (req, res, next) => {
  const wishlistItemId = req.params.wishlistId;
  Wishlist.findByIdAndDelete(wishlistItemId)
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: " Item not found",
        }); 
      }
      res.status(200).json({
        message: "Product removed from wishlist",
        request: {
          type: "POST",
          url: "http://localhost:3000/wishlist",
          body: { productId: "ID" },
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



//GET SINGLE ITEM FROM WISHLIST
exports.get_wishlist_item_control = (req, res, next) => {
  const wishlistId = req.params.wishlistId;
  Wishlist.findById(wishlistId)
    .populate("product") // populate the 'product' field with the details of the product
    .exec()
    .then((wishlistItem) => {
      if (!wishlistItem) {
        return res.status(404).json({
          message: "Wishlist item not found",
        });
      }
      res.status(200).json({
        wishlistItem: wishlistItem,
        request: {
          type: "GET",
          url: "http://localhost:3000/wishlist/" + wishlistId,
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



//MOVE ITEM FROM WISHLIST TO CART
exports.move_to_cart = (req, res, next) => {
  //const productId = new mongoose.Types.ObjectId(req.body.productId);
    const productId = req.body.productId;
  
  // check if the product exists in the wishlist
  Wishlist.findById({ _id: productId })
    .exec()
    .then((wishlistItem) => {
      console.log({ wishlistItem });

      if (!wishlistItem) {
        return res.status(404).json({
          message: "Product not found in wishlist",
        });
      }
        else if (wishlistItem.userId != req.userData.userId) {
          return res.status(401).json({
            message: "You are not authorized to move this product to cart",
          });
        
      } else {
        // create a new cart item with the wishlist product details
          const cartItem = new Cart({
            _id: new mongoose.Types.ObjectId(),
            userId: wishlistItem.userId,
          product: wishlistItem.product,
          name: wishlistItem.name,
        });
        // save the cart item to the cart collection
        cartItem
          .save()
          .then((result) => {
            console.log(result);
            // remove the product from the wishlist
            Wishlist.findByIdAndDelete(wishlistItem._id)
              .exec()
              .then(() => {
                res.status(200).json({
                  message: "Product moved from wishlist to cart",
                  movedItem: {
                    _id: result._id,
                    product: result.product,
                    name: result.name,
                    userId : result.userId,

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

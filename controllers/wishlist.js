const Wishlist = require("../models/wishlist");
const Product = require("../models/product");
const mongoose = require("mongoose");

//ALL ITEMS IN WISHLIST
exports.get_wishlist_control = (req, res, next) => {
    Wishlist.find()
        .select("product _id")
        .populate("product", "name price")
        .exec()
        .then((docs) => {
        res.status(200).json({
            count: docs.length,
            message: "Wishlist fetched",
            wishlist: docs.map((doc) => {
            return {
                _id: doc._id,
                product: doc.product,
                request: {
                type: "GET",
                url: "http://localhost:3000/wishlist/" + doc._id,
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
//     Wishlist.findById(req.body.productId)
//         .then((product) => {
//             console.log(product);
//             if (!product) {
//                 return res.status(404).json({
//                     message: "Product not found",
//                 });
//             }
//             const wishlist = new Wishlist({
//               _id: new mongoose.Types.ObjectId(),
//               product: req.body.productId,
//                 name: req.body.name
              
//             })
//               .save()
//               .then((result) => {
//                 res.status(201).json({
//                   message: "Product added to wishlist",
//                   createdWishlist: {
//                     _id: result._id,
//                     product: result.product,
//                     request: {
//                       type: "GET",
//                       url: "http://localhost:3000/wishlist/" + result._id,
//                     },
//                   },
//                 });
//               })
//               .catch((err) => {
//                 console.log(err);
//                 res.status(500).json({
//                   error: err,
//                 });
//               });
//         })
            
// }

//ADD ITEM TO WISHLIST
exports.create_wishlist_control = (req, res, next) => {
    Wishlist.find({ product: req.body.productId })
        .exec()
        .then((wishlist) => {
            if (wishlist.length >= 1) {
                return res.status(409).json({
                    message: "Product already in wishlist",
                });
            } else {
       const wishlist = new Wishlist({
                    _id: new mongoose.Types.ObjectId(),
                    product: req.body.productId,
                    name: req.body.name
                })
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
        });
};


//DELETE ITEM FROM WISHLIST
exports.delete_wishlist_control = (req, res, next) => {
    Wishlist.findByIdAndDelete({ _id: req.params.wishlistId })
        .exec()
        .then((result) => {
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
}


//GET SINGLE ITEM FROM WISHLIST
exports.get_wishlist_item_control = (req, res, next) => {
    const id = req.params.wishlistId;
    Wishlist.findById(id)
        .select("product _id")
        .populate("product")    
        .exec()
        .then((doc) => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    wishlist: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/wishlist",
                    },
                });
            } else {
                res.status(404).json({ message: "No valid entry found for provided ID" });
            }
        })
    
}
const Product = require("../models/product");
const Order = require("../models/order");
const mongoose = require("mongoose");

//FETCH ALL ORDERS
exports.get_order_control = (req, res, next) => {
  Order.find({ userId: req.userData.userId })
    .populate("product")
    .exec()
    .then((orders) => {
      res.status(200).json({
        count: orders.length,
        message: "Orders were fetched",
        orders: orders.map((order) => {
          return {
            _id: order._id,
            product: order.product,
            quantity: order.quantity,
            date: order.date,

            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + order._id,
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


//CREATE AN ORDER
exports.create_order_control = (req, res, next) => {
  if (req.userData.userId == null) {
    return res.status(401).json({
      message: "You are not authorized to order ",
    });
  }
  Product.find({ product: req.body.productId })
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      } else {
        const order = new Order({
          _id: new mongoose.Types.ObjectId(),
          userId: req.userData.userId,
          product: req.body.productId,
          quantity: req.body.quantity || 1,
        });
        order
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              message: "Order created",
              createdOrder: {
                _id: result._id,
                userId: result.userId,
                product: result.product,
                quantity: result.quantity,
                date: result.date,
                request: {
                  type: "GET",
                  url: "http://localhost:3000/orders/" + result._id,
                },
              },
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
              message: "something went wrong!!!"
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



//FETCH A SINGLE ORDER
exports.fetch_Singleorder_control = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(req.params.orderId)
    .populate("product")
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
};


//DELETE AN ORDER
exports.delete_order_control = (req, res, next) => {
  Order.findByIdAndDelete({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      if (!result) {
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
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

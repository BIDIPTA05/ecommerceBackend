const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/auth_check");
const ordersController = require("../controllers/order")


//GET ALL ORDERS
router.get("/",checkAuth,ordersController.get_order_control );

//CREATE AN ORDER
router.post("/", ordersController.create_order_control);

//FETCH A SINGLE ORDER
router.get("/:orderId", checkAuth, ordersController.fetch_Singleorder_control);

//DELETE AN ORDER
router.delete("/:orderId", checkAuth, ordersController.delete_order_control);

module.exports = router;

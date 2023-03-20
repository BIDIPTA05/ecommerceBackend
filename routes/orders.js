const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/auth_check");
const get_order_control = require("../controllers/order")
const create_order_control = require("../controllers/order")
const fetch_Singleorder_control = require("../controllers/order")
const delete_order_control = require("../controllers/order")

//GET ALL ORDERS
router.get("/",checkAuth,get_order_control );

//CREATE AN ORDER
router.post("/", checkAuth, create_order_control);

//FETCH A SINGLE ORDER
router.get("/:orderId", checkAuth, fetch_Singleorder_control);

//DELETE AN ORDER
router.delete("/:orderId", checkAuth, delete_order_control);

module.exports = router;

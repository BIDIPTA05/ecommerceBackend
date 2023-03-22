const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/auth_check");
const cartController = require("../controllers/cart");


//ADD TO CART
router.post("/", cartController.create_cart_control);

//GET ALL CART DETAILS
router.get("/",  cartController.get_cart_control);

//FETCH A PRODUCT FROM CART
//router.get("/:productId",  cartController.fetch_Singleorder_control);

//DELETE A PRODUCT FROM CART
//router.delete("/:productId",  cartController.delete_order_control);

module.exports = router;
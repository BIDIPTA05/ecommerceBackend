const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/auth_check");
const cartController = require("../controllers/cart");


//ADD TO CART
router.post("/", cartController.create_cart_control);

//GET ALL CART DETAILS
router.get("/",  cartController.get_cart_control);

//FETCH A PRODUCT FROM CART
router.get("/:cartId",  cartController.get_cart_item_control);

//DELETE A PRODUCT FROM CART
router.delete("/:cartId", cartController.delete_cart_item_control);

//MOVE TO WISHLIST FROM CART
router.post("/movetowishlist", cartController.move_to_wishlist);

//MOVE TO ORDERS FROM CART
router.post("/movetoorders", cartController.move_to_orders);



module.exports = router;

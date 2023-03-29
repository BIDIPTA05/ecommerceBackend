const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/auth_check");


const wishController = require("../controllers/wishlist");

//GET ALL WISHLIST ITEMS
router.get("/",checkAuth, wishController.get_wishlist_control);

//ADD A PRODUCT TO WISHLIST
router.post("/",checkAuth, wishController.create_wishlist_control);

//FETCH A PRODUCT FROM WISHLIST
router.get("/:wishlistId",checkAuth, wishController.get_wishlist_item_control);

//DELETE A PRODUCT FROM WISHLIST
router.delete("/:wishlistId",checkAuth, wishController.delete_wishlist_control);

//ADD TO CART FROM WISHLIST
router.post("/movetocart",checkAuth, wishController.move_to_cart);

//testinggg

module.exports = router;




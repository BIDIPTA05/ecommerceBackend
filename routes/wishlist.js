const express = require("express");
const router = express.Router();

const wishController = require("../controllers/wishlist");

//GET ALL WISHLIST ITEMS
router.get("/", wishController.get_wishlist_control);

//ADD A PRODUCT TO WISHLIST
router.post("/", wishController.create_wishlist_control);

//FETCH A PRODUCT FROM WISHLIST
router.get("/:wishlistId", wishController.get_wishlist_item_control);

//DELETE A PRODUCT FROM WISHLIST
router.delete("/:wishlistId", wishController.delete_wishlist_control);

//ADD TO CART FROM WISHLIST
router.post("/movetocart", wishController.move_to_cart);

//testinggg

module.exports = router;




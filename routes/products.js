const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/auth_check");
const productController = require("../controllers/product");


//GET ROUTE- GET ALL PRODUCTS
router.get("/", productController.get_product_control);

//POST ROUTE- UPLOAD A PRODUCT
router.post("/", checkAuth, productController.post_product_control);

//GET SINGLE PRODUCT ROUTE
router.get("/:productId", productController.getSingle_product_control);

//UPDATE PRODUCT ROUTE
router.patch("/:productId", checkAuth, productController.update_product_control);

//DELETE PRODUCT ROUTE
router.delete("/:productId", checkAuth, productController.delete_product_control);

//EXPORTING TO USE IN DIFFERENT PLACES
module.exports = router;

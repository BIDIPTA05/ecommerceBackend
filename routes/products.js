const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/auth_check");
const get_product_control = require("../controllers/product");
const post_product_control = require("../controllers/product");
const getSingle_product_control = require("../controllers/product");
const update_product_control = require("../controllers/product");
const delete_product_control = require("../controllers/product")

//GET ROUTE- GET ALL PRODUCTS
router.get("/", get_product_control);

//POST ROUTE- UPLOAD A PRODUCT
router.post("/", checkAuth, post_product_control);

//GET SINGLE PRODUCT ROUTE
router.get("/:productId", getSingle_product_control);

//UPDATE PRODUCT ROUTE
router.patch("/:productId", checkAuth, update_product_control);

//DELETE PRODUCT ROUTE
router.delete("/:productId", checkAuth, delete_product_control);

//EXPORTING TO USE IN DIFFERENT PLACES
module.exports = router;

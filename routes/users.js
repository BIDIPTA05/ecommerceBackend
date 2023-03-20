const express = require("express");
const router = express.Router();
const userController = require("../controllers/user")

//CREATE AN USER
router.post("/signup", userController.create_user_control);

//LOGIN A USER
router.post("/login", userController.login_user_control);


//DELETE A USER
router.delete("/:userId", userController.delete_user_control);

//GET ALL USERS
router.get("/", userController.get_allUsers_control);


module.exports = router;




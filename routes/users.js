const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const checkAuth = require("../middleware/auth_check");

//CREATE AN USER
router.post("/signup", userController.create_user_control);

//LOGIN A USER
router.post("/login",checkAuth, userController.login_user_control);

//DELETE A USER
router.delete("/:userId", userController.delete_user_control);

//GET ALL USERS
router.get("/", userController.get_allUsers_control);

//SUPER-ADMIN CREATION using an existing user admin
//router.put("/:userId/super-admin", userController.set_super_admin)

//All Super Admins Fetched
router.get("/superadmins", userController.get_super_admin);

module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const create_user_control = require("../controllers/user")
const delete_user_control = require("../controllers/user")
const get_allUsers_control = require("../controllers/user")
const login_user_control = require("../controllers/user")

//CREATE AN USER
router.post("/signup", create_user_control);

//DELETE A USER
router.delete("/:userId", delete_user_control);

//GET ALL USERS
router.get("/", get_allUsers_control);

//LOGIN A USER
router.post("/login", login_user_control);

module.exports = router;

const User = require("../models/user")
const mongoose = require("mongoose")



const isSuperAdmin = (req, res, next) => {
  if (req.body.email === "bidipta@admin.com") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as admin" });
  }
};

module.exports = isSuperAdmin;
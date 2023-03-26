const user = require("../models/user")
const mongoose = require("mongoose")

module.exports = (req, res, next) => {
    const user = req.user;
  if (user && user.isSuperAdmin) {
    next();
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
};



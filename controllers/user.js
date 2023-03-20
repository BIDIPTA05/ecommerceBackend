const User = require("../models/user")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

exports.create_user_control = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              name: req.body.name,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User created successfully",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};



exports.login_user_control = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Invalid Auth",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        console.log(err);
        if (err) {
          return res.status(401).json({
            error: err,
            message: "Invalid Auth",
          });
        }
        if (result) {
          console.log(result);
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );
          console.log(token);
          return res.status(200).json({
            message: "Successfully Logged in",
            token: token,
          });
        }
        return res.status(401).json({
          message: "Invalid Auth",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "unsuccessful attempt",
        error: err,
      });
    });
};

exports.delete_user_control = (req, res, next) => {
  User.findByIdAndDelete({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_allUsers_control = (req, res, next) => {
  User.find()
    .select("name email _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        users: docs.map((doc) => {
          return {
            name: doc.name,
            email: doc.email,
            _id: doc._id,
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

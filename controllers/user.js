const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

//NEW USER CREATE
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


const response = async () =>
  await fetch(`${API_BASE_URL}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

//LOGIN USER
exports.login_user_control = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Invalid Auth",
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        console.log(err);
        if (err) {
          return res.status(401).json({
            error: err,
            message: "Invalid Auth",
          });
        }
        if (result) {
          //req.session.user_id = user._id;
          console.log(result);
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
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



//DELETE AN USER
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

//GET ALL USERS
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

//SET AN USER AS SUPER ADMIN
// exports.set_super_admin = (req, res, next)=>{
//   const userId = req.params.userId;
//   // Find the user with the provided ID
//   console.log(userId);
//   User.findById(userId)
//     .then(user => {
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       // Update the user to be a super admin
//       user.isSuperAdmin = true;
//       return user.save();
//     })
//     .then(user => {
//       res.json(user);
//     })
//     .catch((err) => {
//     res.status(500).json({
//       error :err
//     })
//     })
// }

//GET ALL SUPER ADMINS
exports.get_super_admin = (req, res, next) => {
  User.find({ isSuperAdmin: true })
    .exec()
    .then((users) => {
      res.status(200).json({
        count: users.length,
        message: "List of Super Admins fetched",
        superAdmins: users.map((users) => {
          return {
            _id: users._id,
            name: users.name,
            email: users.email,
          };
        }),
      });
    })

    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

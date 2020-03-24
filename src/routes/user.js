const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const environment = require('../config/environment')

const router = express.Router();


const User = require("../model/User");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.raw());

router.post(
  "/signup",
  async (req, res) => {
    const errors = [];

    const {
      username,
      email,
      password
    } = req.body;
    if (!username) {
      errors.push("username is required")
    }
    if (!password) errors.push("password is required")


    if (errors.length > 0) {
      return res.status(400).json({
        errors: errors
      });
    }


    try {
      let user = await User.findOne({ "username": username });
      if (user) {
        return res.status(400).json({
          msg: "Username Already Exists"
        });
      }

      user = new User({
        username,
        email,
        password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;

          user.password = hash
          user.save();
        });
      });

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        environment.JWT_KEY, {
        expiresIn: 10000
      },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

router.post(
  "/login",
  async (req, res) => {
    const { username, password } = req.body;

    const errors = [];


    if (!username) {
      errors.push("username is required")
    }
    if (!password) errors.push("password is required");

    try {
      let user = await User.findOne({
        username
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist"
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !"
        });

      const payload = {
        user: {
          id: user.id
        }
      };

      user.excludePassword()

      jwt.sign(
        payload,
        environment.JWT_KEY,
        {
          expiresIn: "1h"
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token, user
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);


module.exports = router;

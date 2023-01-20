const express = require("express");
const User = require("../models/user");
const Interest = require("../models/userinterest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const file = require("../models/file");
require("dotenv").config();

var sess;

//User Login
const authUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username }).exec()

  if (!user) {
    return res.status(404).json({ status: "error", error: "Invalid Username/Password" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT
    );
    sess = req.session;
    sess.user = user.username;
    sess.token = token;
    return res.status(200).json({ status: "ok", user: sess.user });
  }

  res.status(404).json({ status: "error", error: "Invalid username/pasword" });
};

//User Registration
const registerUser = async (req, res) => {
  const { username, password: plainTextPassword, confirmPassword } = req.body;
  const interest = req.body.interests;

  if (!username || typeof username !== "string") {
    return res.status(404).json({
      status: "error",
      error: "Invalid Username",
    });
  }

  /* if(plainTextPassword !== reEnterPassword) {
        return res.json({
            status: 'error',
            error: 'Password Does not Match'
        })
    } */

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.status(404).json({
      status: "error",
      error: "Invalid Password",
    });
  }

  if (plainTextPassword.length < 8) {
    return res.status(404).json({
      status: "error",
      error: "Password should be atleast 8",
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    await User.create({
      username,
      password,
    });

    await Interest.create({
      username,
      interest,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(404).json({ status: "error", error: "Username Already in use" });
    } else {
      console.log(error);
      return res.status(404).json({
        status: "error",
        error: "An error occurred during registration. Try again Later",
      });
    }
  }

  res.status(200).json({ status: "OK", message: "Account Created Successfully" });
};

//User Logout
const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(404).json({
        status: "error",
        error: "An error occurred during signout. Try again Later",
      });
    }
    res.status(200).json({message: "Logout successful"});
  });
};

//Change Password
const changePassword = async (req, res) => {
  let sess = req.session;
  if (sess.user) {
    const { newPassword: plainTextPassword, reEnterPassword } = req.body;

    const token = sess.token;

    /* if (plainTextPassword.length < 8) {
      return res.status(404).json({
        status: "error",
        error: "Password should be atleast 8",
      });
    } */

    /* if(plainTextPassword !== reEnterPassword) {
            return res.json({
                status:'error', 
                error: 'Password not the same'
            })
        } */

        console.log(token)
    try {
      const user = jwt.verify(token, process.env.JWT);
      const _id = user.id;

      const password = await bcrypt.hash(plainTextPassword, 10);

      await User.updateOne(
        { _id },
        {
          $set: { password: password },
        }
      );
      res.status(200).status(404).json({ status: "ok" });
    } catch (error) {
      console.log(error);
      res.json({ status: "error", error: "Contact the Administrator" });
    }
  } else {
    res.json({message: "User not logged In"});
  }
};

const profile = async (req, res) => {
  const { id: profile } = req.params;
  const user = await User.findOne({ username: profile });

  if (!user) {
    return res.status(404).json({ status: "error", error: "Not Found" });
  }

  const created = await file.find({ user: user.username });

  res.status(200).json({ items: created, name: user.username });
};

module.exports = {
  authUser,
  registerUser,
  logoutUser,
  changePassword,
  profile,
};

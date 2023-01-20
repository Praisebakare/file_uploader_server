const express = require("express");
const router = express.Router();

const {
  authUser,
  registerUser,
  logoutUser,
  changePassword,
  profile,
} = require("../controller/auth");

const {
  getAll,
  forYou,
  uploadFile,
  getCreated,
  deleteFile,
} = require("../controller/file");

//Authentication
router.route("/user/login").post(authUser);
router.route("/user/register").post(registerUser);
router.route("/user/changepassword").post(changePassword);
router.route("/user/logout").get(logoutUser);
router.route("/user/:id").get(profile);

//File
router.route("/getAll").get(getAll);
router.route("/forYou").get(forYou);
router.route("/uploadFile").post(uploadFile);
router.route("/getCreated").get(getCreated);
router.route("/delete/:id").delete(deleteFile);

module.exports = router;

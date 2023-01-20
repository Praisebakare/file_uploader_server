const express = require("express");
const File = require("../models/file");
const Interest = require("../models/userinterest");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const getAll = async (req, res) => {
  let sess = req.session;
  if (sess.user) {
    File.find({}, (err, items) => {
      if (err) {
        console.log(err);
        res.status(404).json({ status: "error", error: "An error occurred" });
      } else {
        const shuffleItem = items.sort((a, b) => 0.5 - Math.random())

        res.status(200).json({
          status: "ok",
          items: shuffleItem,
          user: sess.user,
          link: `/${sess.user}`,
        });
      }
    });
  } else {
    File.find({}, (err, items) => {
      if (err) {
        console.log(err);
        res.status(404).json({ status: "error", error: "An error occurred" });
      } else {
        const shuffleItem = items.sort((a, b) => 0.5 - Math.random())
        res.status(200).json({ status: "ok", items: shuffleItem });
      }
    });
  }
};

const forYou = async (req, res) => {
  let sess = req.session;
  if (sess.user) {
    const interest = await Interest.findOne({ username: sess.user }).exec();
    const titles = interest.interest;
    const fil = await File.find({}).exec();

    const filterimage = fil.filter((item) => {
      return titles.includes(item.desc);
    });
    const shuffleItem = filterimage.sort((a, b) => 0.5 - Math.random())

    res.status(200).json({
      status: "ok",
      items: shuffleItem /*  user: sess.user, link: `/${sess.user}` */,
    });
  } else {
    res.json({message: "User not signed In"});
  }
};

const uploadFile = async (req, res) => {
  let sess = req.session;
  if (sess.user) {
    try {
      //formats, creation date, file type

      // file, name, interest
      const data = {
        file: req.body.file,
      };

      cloudinary.uploader.upload(data.file).then(async (result) => {
        const format = result.format;
        const creation_date = result.created_at;
        const filename = result.original_filename;
        const fileUrl = result.url;

        await File.create({
          user: sess.user,
          name: req.body.name,
          interest: req.body.interest,
          format: format,
          creation_date: creation_date,
          filename: filename,
          fileUrl: fileUrl,
        });
        res.json({message: "Created Successufully"});
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ status: "error", message: "An error occurred" });
    }
  } else {
    res.json({message: "User not signed In"});
  }
};

const getCreated = async (req, res) => {
  let sess = req.session;
  if (sess.user) {
    try {
      File.find({ user: sess.user }, (err, items) => {
        if (err) {
          console.log(err);
          res.json({ status: "error", error: "An error occurred" });
        } else {
          res.status(200).json({ status: "ok", items: items });
        }
      });
    } catch (error) {
      res.status(404).json({ status: "error", message: "An error occurred" });
    }
  } else {
    res.json({message: "User not signed In"});
  }
};

const deleteFile = async (req, res) => {
  let sess = req.session
  if (sess.user) {
    const { id: fileID } = req.params
    const file = await File.findOneAndDelete({ _id: fileID, user: sess.user })
    if (!file) {
      return res.status(404).json({error: "File not found"})
    }
    res.status(200).json({ file })
  } else {
    res.json({message: "User not signed In"});
  }
};

module.exports = {
  getAll,
  forYou,
  uploadFile,
  getCreated,
  deleteFile,
};

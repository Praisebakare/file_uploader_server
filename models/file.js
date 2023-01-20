const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    user: String,
    name: String,
    desc: String,
    format: String,
    creation_date: String,
    filename: String,
    fileUrl: String,
  },
  { collection: "file" }
);

const file = mongoose.model("file", fileSchema);

module.exports = file;

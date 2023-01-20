const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Route = require("./routes/route");
const connectDB = require("./db/dbconnect");
const cors = require("cors");
const session = require("express-session");
const fs = require("fs");
require("dotenv").config()

//middleware
app.use(cors());
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "bakarepraise3",
    saveUninitialized: true,
    resave: false,
  })
);

app.use("/api/fileupload", Route);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log("DB connected successfully");
    app.listen(
      process.env.PORT,
      console.log(`Server is listening on port ${process.env.PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
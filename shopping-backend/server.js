const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const compression = require('compression')
const cors = require("cors");
require("dotenv").config();

const app = express();

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.yfg2i.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("file")
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(compression())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(require("./routes/product"));
app.use(require("./routes/user"));
app.use(require("./routes/admin"));
app.use(require("./routes/tokenIsValid"));
app.use(require("./routes/cart"))
app.use(require("./routes/order"))
app.use(require('./routes/admin_products'))


const PORT = process.env.PORT || 4000;

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Connected to localhost" + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });

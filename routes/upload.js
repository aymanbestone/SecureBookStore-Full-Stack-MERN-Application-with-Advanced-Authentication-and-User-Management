const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { date } = require("joi");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const apload =  multer({ storage });

router.post("/", apload.single("image"), (req, res) => {
  res.json({ message: "upload image !!" });
});

module.exports = router;

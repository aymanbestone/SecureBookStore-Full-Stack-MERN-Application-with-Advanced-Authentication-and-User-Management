const express = require("express");

const router = express.Router();
router.use(express.json());
const {
  registerUser,
  loginUser,
} = require("../controllers/authUserController");
///authUsers/register
router.post("/register", registerUser);
//authUsers/login
router.post("/login", loginUser);

module.exports = router;

const express = require("express");
const router = express.Router();
router.use(express.json());
const {
  verifyToken,
  verifyTokenAndautorize,
  verifyTokenAndadmin,
} = require("../middlwares/verifyToken");

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");

router.route("/").get(verifyTokenAndadmin, getAllUsers);

router
  .route("/:id")
  .get(verifyTokenAndautorize, getUserById)
  .put(verifyTokenAndautorize, updateUser)
  .delete(verifyTokenAndautorize, deleteUser);

module.exports = router;

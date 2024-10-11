const express = require("express");
const router = express.Router();
const { verifyTokenAndadmin } = require("../middlwares/verifyToken");
const {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");

router.route("/").get(getAllAuthors).post(verifyTokenAndadmin, createAuthor);
router
  .route("/:id")
  .get(getAuthorById)
  .put(verifyTokenAndadmin, updateAuthor)
  .delete(verifyTokenAndadmin, deleteAuthor);

module.exports = router;

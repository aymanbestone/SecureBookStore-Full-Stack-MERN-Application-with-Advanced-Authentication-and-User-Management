const express = require("express");
const router = express.Router();
router.use(express.json());
const { verifyTokenAndadmin } = require("../middlwares/verifyToken");
const { getByLabelText } = require("@testing-library/react");
const {
  getAllBooks,
  getBookById,
  createNewBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

router.route("/").get(getAllBooks).post(verifyTokenAndadmin, createNewBook);
router
  .route("/:id")
  .get(getBookById)
  .put(verifyTokenAndadmin, updateBook)
  .delete(verifyTokenAndadmin, deleteBook);

module.exports = router;

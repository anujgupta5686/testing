const express = require("express");
const {
  addBook,
  getBookById,
  getAllBooks,
  updateBook,
  deleteBook,
} = require("../components/book.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/add", upload.single("bookImage"), addBook);
router.get("/:id", getBookById);
router.get("/", getAllBooks);
router.put("/update/:id", upload.single("bookImage"), updateBook);
router.delete("/delete/:id", deleteBook);

module.exports = router;
